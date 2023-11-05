import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:http/http.dart' as http;
import 'ChangePasswd.dart';
import '../Component/CardComponent.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  String? _avatarUrl;
  String? _name;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final storage = FlutterSecureStorage();
    final avatar = await storage.read(key: 'avatar');
    final collectionId = await storage.read(key: 'collectionId');
    final userId = await storage.read(key: 'userId');
    final name = await storage.read(key: 'name');
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];

    final isValid = await _checkImageValidity(
        '$apiUrl/api/files/$collectionId/$userId/$avatar');

    setState(() {
      _avatarUrl = isValid
          ? '$apiUrl/api/files/$collectionId/$userId/$avatar'
          : 'assets/avatar.png';
      _name = name;
    });
  }

  Future<bool> _checkImageValidity(String? imageUrl) async {
    if (imageUrl != null) {
      var response = await http.head(Uri.parse(imageUrl));
      if (response.statusCode == 200) {
        print('L\'image est valide.');
        return true;
      } else {
        print('L\'image n\'est pas valide.');
        return false;
      }
    }
    return false;
  }

  Future<List> _fetchServiceIds() async {
    final storage = FlutterSecureStorage();
    final userId = await storage.read(key: 'userId');
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];

    final filter = 'user_id = "$userId"';

    final pb = PocketBase(apiUrl!);
    final response =
        await pb.collection('users_credentials').getList(filter: filter);

    List serviceIds =
        response.items.map((item) => item!.data['service_id']).toList();

    return serviceIds;
  }

  Future<List<Map<String, dynamic>>> _fetchService() async {
    final serviceIds = await _fetchServiceIds();
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];

    final filter = '(${serviceIds.map((id) => "id='$id'").join(" || ")})';
    print('Filter: $filter');

    final pb = PocketBase(apiUrl!);
    final response = await pb.collection('services').getList(filter: filter);

    List<Map<String, dynamic>> updatedServices = [];

    for (var service in response.items) {
      print(service);
      updatedServices.add({
        "color":
            Color(int.parse(service!.data['color'].replaceAll('#', '0xFF'))),
        "title": service!.data['name'],
        "text": service!.data['description'],
        "credentials": service!.data['credentials']
      });
    }

    return updatedServices;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE8E0D9),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _avatarUrl != null
                ? Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(100.0),
                        child: Container(
                          width: 200,
                          height: 200,
                          child: _avatarUrl!.startsWith('http')
                              ? Image.network(
                                  _avatarUrl!,
                                  fit: BoxFit.cover,
                                )
                              : Image.asset(
                                  _avatarUrl!,
                                  fit: BoxFit.cover,
                                ),
                        ),
                      ),
                      SizedBox(height: 20),
                      _name != null
                          ? Text(
                              _name!,
                              style: TextStyle(
                                fontSize: 25,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            )
                          : Container(),
                    ],
                  )
                : CircularProgressIndicator(),
            SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    primary: Colors.black,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0)),
                  ),
                  child: const Text('Modifier Profil'),
                ),
                SizedBox(width: 20),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ChangePasswordPage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    primary: Colors.black,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0)),
                  ),
                  child: Text('Changer mot de passe'),
                ),
              ],
            ),
            SizedBox(height: 20),
            Text(
              'Vos services:',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            SizedBox(height: 10),
            FutureBuilder<List<Map<String, dynamic>>>(
  future: _fetchService(),
  builder: (context, serviceSnapshot) {
    if (serviceSnapshot.connectionState == ConnectionState.waiting) {
      return Center(child: CircularProgressIndicator());
    } else if (serviceSnapshot.hasError) {
      if (serviceSnapshot.error.toString().contains('400')) {
        return Center(child: Text('Aucun service connecté.'));
      }
      return Center(child: Text('Error: ${serviceSnapshot.error}'));
    } else if (serviceSnapshot.data?.isEmpty ?? true) {
      return Center(child: Text('Aucun service connecté.'));
    } else {
      return Container(
        height: 200,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: serviceSnapshot.data?.length ?? 0,
          itemBuilder: (context, index) {
            var service = serviceSnapshot.data![index];
            return Padding(
              padding: const EdgeInsets.all(7.0),
              child: CustomRectangle(
                color: service["color"],
                title: service["title"],
                text: service["text"],
                serviceUrl: service["credentials"],
              ),
            );
          },
        ),
      );
    }
  },
),

          ],
        ),
      ),
    );
  }
}

void main() => runApp(MaterialApp(home: ProfilePage()));
