import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'HomePage.dart';
import 'ProfilePage.dart';
import 'DiscoverPage.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'CreatePage.dart';

class DashboardPage extends StatefulWidget {
  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;
  String? _avatarUrl;
  late List<SalomonBottomBarItem> _navBarItems;

  @override
  void initState() {
    super.initState();

    _navBarItems = [
      SalomonBottomBarItem(
        icon: Icon(Icons.home),
        title: Text("Home"),
        selectedColor: Color.fromARGB(255, 145, 174, 138),
      ),
      SalomonBottomBarItem(
        icon: Icon(Icons.add),
        title: Text("Create"),
        selectedColor: Color.fromARGB(255, 145, 174, 138),
      ),
      SalomonBottomBarItem(
        icon: Icon(Icons.person_outline), // Use default icon initially
        title: Text("Profile"),
        selectedColor: Color.fromARGB(255, 145, 174, 138),
      ),
    ];

    _fetchAvatar(); // Fetch avatar after initializing _navBarItems
  }

  Future<void> _fetchAvatar() async {
  final storage = FlutterSecureStorage();
  final avatar = await storage.read(key: 'avatar');
  final collectionId = await storage.read(key: 'collectionId');
  final userId = await storage.read(key: 'userId');
  await dotenv.load();
  final apiUrl = dotenv.env['API_URL'];

  final isValid = await _checkImageValidity('$apiUrl/api/files/$collectionId/$userId/$avatar');

  setState(() {
    _avatarUrl = isValid ? '$apiUrl/api/files/$collectionId/$userId/$avatar' : null;

    _navBarItems[3] = SalomonBottomBarItem(
      icon: _avatarUrl != null
          ? ClipOval(
              child: Image.network(
                _avatarUrl!,
                width: 24,
                height: 24,
                fit: BoxFit.cover,
              ),
            )
          : Icon(Icons.person_outline),
      title: Text("Profile"),
      selectedColor: Color.fromARGB(255, 145, 174, 138),
    );
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFE8E0D9),
      body: SafeArea(
        child: Center(
          child: _getPage(_selectedIndex),
        ),
      ),
      bottomNavigationBar: SalomonBottomBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.purple,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: _navBarItems,
      ),
    );
  }

  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return HomePage();
      case 1:
        return CreatePage();
      case 2:
        return ProfilePage();
      default:
        return HomePage();
    }
  }
}
