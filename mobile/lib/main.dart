import 'package:flutter/material.dart';
import 'package:mobile/src/loading_page.dart';
import 'package:mobile/src/login.dart';
import 'package:mobile/src/signup_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ZigZag Loading Page',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: const LoadingPage(),
      routes: {
        '/signup': (context) => SignupPage(),
      },
    );
  }
}
