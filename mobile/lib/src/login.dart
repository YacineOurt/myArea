// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'login_email.dart';
import 'signup_page.dart';

class NewPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFEFBF5),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: 50),
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: Text(
                'ZigZag',
                style: TextStyle(fontSize: 35, color: Colors.black),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: CustomElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPage()),
                  );
                },
                icon: Image.asset('assets/email.png', height: 24, width: 24),
                label: 'Email',
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: CustomElevatedButton(
                onPressed: () {
                  // Action à effectuer lorsque le bouton "Google" est pressé
                },
                icon: Image.asset('assets/google.png', height: 24, width: 24),
                label: 'Continue with Google',
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: CustomElevatedButton(
                onPressed: () {
                  // Action à effectuer lorsque le bouton "Apple" est pressé
                },
                icon: Image.asset('assets/apple.png', height: 24, width: 24),
                label: 'Continue with Apple',
              ),
            ),
            SizedBox(height: 20),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SignupPage()),
                  );
              },
              child: Text(
                'You don’t have an account ? Create it',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.black,
                  decoration: TextDecoration.underline,
              ),
            ),
          ),
          SizedBox(height: 50),
          ],
        ),
      ),
    );
  }
}

class CustomElevatedButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Widget icon;
  final String label;

  const CustomElevatedButton({
    Key? key,
    this.onPressed,
    required this.icon,
    required this.label,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(200, 50), backgroundColor: Colors.white,
      ),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: FittedBox(child: icon),
          ),
          const SizedBox(width: 10), // Utilisation de 'const' ici
          Text(
            label,
            style: const TextStyle(fontSize: 18, color: Colors.black), // Utilisation de 'const' ici
          ),
        ],
      ),
    );
  }
}
