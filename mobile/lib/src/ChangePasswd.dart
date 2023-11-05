import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dashboard.dart';

class ChangePasswordPage extends StatefulWidget {
  @override
  _ChangePasswordPageState createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  String? _newPassword;
  String? _oldPassword;
  String? _storedOldPassword;

  @override
  void initState() {
    super.initState();
    _fetchStoredOldPassword();  
  }

  Future<void> _fetchStoredOldPassword() async {
    final storage = FlutterSecureStorage();
    final storedOldPassword = await storage.read(key: 'oldpass');
    setState(() {
      _storedOldPassword = storedOldPassword;
    });
  }

  Future<void> _UpdatePassWd(String? password, String? oldpass) async {
    final storage = FlutterSecureStorage();
    final name = await storage.read(key: 'name');
    final username = await storage.read(key: 'username');
    final id = await storage.read(key: 'userId');
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];
    final pb = PocketBase('${apiUrl}');
    final body = <String, dynamic>{
      "username": "${username}",
      "emailVisibility": false,
      "password": "${password}",
      "passwordConfirm": "${password}",
      "oldPassword": "${oldpass}",
      "name": "${name}"
    };
    print(id);
    final record = await pb.collection('users').update('${id}', body: body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE8E0D9),
      body: SafeArea(
        child: ColoredBox(
          color: Color(0xFFE8E0D9),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Modifier le mot de passe',
                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 25),
                TextFormField(
                  onChanged: (value) {
                    setState(() {
                      _newPassword = value;
                    });
                  },
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Nouveau mot de passe',
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: 25),
                TextFormField(
                  onChanged: (value) {
                    setState(() {
                      _oldPassword = value;
                    });
                  },
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Ancien mot de passe',
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: 24),
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      if (_newPassword != null && _oldPassword != null) {
                        if (_newPassword!.length >= 6 &&
                            _oldPassword!.length >= 6 &&
                            _oldPassword == _storedOldPassword) {
                          _UpdatePassWd(_newPassword, _oldPassword);
                          print('Mot de passe modifié avec succès !');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => DashboardPage()),
                          );
                        } else {
                          print(
                              'Les mots de passe doivent comporter au moins 8 caractères.');
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      primary: Colors.black,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0)),
                    ),
                    child: Text('Valider'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

void main() => runApp(MaterialApp(home: ChangePasswordPage()));
