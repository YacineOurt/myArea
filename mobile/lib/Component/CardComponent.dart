// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter_web_auth/flutter_web_auth.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class CustomRectangle extends StatelessWidget {
  final bool isSelected;
  final Color color;
  final String title;
  final String text;
  final String serviceUrl;
  final VoidCallback? onTap;
  final VoidCallback? onSelectService;
  final String buttonText;
  final String description;
  final String name;
  final bool showButton;

  CustomRectangle({
    Color? color,
    String? title,
    String? text,
    String? serviceUrl,
    String? description,
    String? name,
    this.isSelected = false,
    this.onTap,
    this.onSelectService,
    this.showButton = false,
    this.buttonText = 'Connexion',
  })  : color = isSelected ? Colors.grey : (color ?? Colors.white),
        title = title ?? " ",
        text = text ?? "",
        serviceUrl = serviceUrl ?? "www.google.com",
        description = description ?? " ",
        name = name ?? " ";

  Future<void> _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  Future<void> _handleWebAuthentication() async {
    try {
      final result = await FlutterWebAuth.authenticate(
        url: serviceUrl,
        callbackUrlScheme: "com.example.zigzag",
      );
      final storage = FlutterSecureStorage();
      final userId = await storage.read(key: 'userId');

      final uri = Uri.parse(result);
      final code = uri.queryParameters['code'];

      await handleSpotify(code, userId);

      print("Web Authentication Result: $result");
    } catch (e) {
      print("Web Authentication Error: $e");
    }
  }

  Future<void> handleSpotify(String? code, String? userId) async {
    print('Code: $code, UserID: $userId');
    if (code != null && userId != null) {
      print('Code: $code, UserID: $userId');
    } else {
      print('Code ou UserID est null');
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onSelectService?.call();
        if (onSelectService == null) {
          _handleWebAuthentication();
        }
      },
      child: Container(
        width: 150,
        height: 200,
        decoration: BoxDecoration(
          color: isSelected ? Colors.grey.withOpacity(0.7) : color,
          borderRadius: BorderRadius.circular(20.0),
        ),
        child: ListView(
          padding: EdgeInsets.all(10.0),
          children: [
            if (name.isNotEmpty)
              Text(
                name,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            if (description.isNotEmpty)
              Text(
                description,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                )
              ),
            if (title.isNotEmpty)
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            if (text.isNotEmpty)
              SizedBox(height: 10.0),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10.0),
                child: Text(
                  text,
                  maxLines: 4,
                  overflow: TextOverflow.ellipsis,
                  //textAlign: TextAlign center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ),
              if (showButton)
                SizedBox(height: 20.0),
                Container(
                  padding: EdgeInsets.all(10.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10.0),
                  ),

                  child: Text(
                    buttonText,
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.black,
                    ),
                  ),
                )
          ],
        ),
      ),
    );
  }
}