import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/src/dashboard.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _storage = FlutterSecureStorage();
  String errorMessage = '';

  Future<void> _login(
      String username, String password, BuildContext context) async {
    setState(() {
      errorMessage = ''; // Réinitialiser le message d'erreur à chaque tentative de connexion
    });

    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];
    final pb = PocketBase(apiUrl!);

    try {
      final authData =
          await pb.collection('users').authWithPassword(username, password);
      if (pb.authStore.isValid) {
        await _storage.write(key: 'token', value: pb.authStore.token);
        await _storage.write(key: 'userId', value: authData.record!.id);
        await _storage.write(
            key: 'collectionId', value: authData.record!.collectionId);
        await _storage.write(
            key: 'username', value: authData.record!.data['username']);
        await _storage.write(key: 'email', value: authData.record!.data['email']);
        await _storage.write(key: 'name', value: authData.record!.data['name']);
        await _storage.write(
            key: 'avatar', value: authData.record!.data['avatar']);
        await _storage.write(key: 'oldpass', value: password);

        print('Utilisateur connecté');
        print('${authData}');
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => DashboardPage()),
        );
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Erreur d\'authentification'; // Mettez à jour le message d'erreur en cas d'échec de connexion
      });
      print('Erreur d\'authentification: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    String email = '';
    String password = '';

    return Scaffold(
      backgroundColor: const Color(0xFFFEFBF5),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(
                'Connexion',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              TextFormField(
                onChanged: (value) {
                  email = value;
                },
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              TextFormField(
                onChanged: (value) {
                  password = value;
                },
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Mot de passe',
                  border: OutlineInputBorder(),
                ),
              ),
              if (errorMessage.isNotEmpty) // Affichez le message d'erreur s'il y a une erreur
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Text(
                    errorMessage,
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: () {
                  _login(email, password, context);
                },
                style: ElevatedButton.styleFrom(
                  primary: Colors.black,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0)),
                ),
                child: const Text('Se connecter'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
