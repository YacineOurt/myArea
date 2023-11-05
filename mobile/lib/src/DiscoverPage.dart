import 'package:flutter/material.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/Component/CardComponent.dart';
import 'package:mobile/Component/ZigZagComponent.dart';

class DiscoverPage extends StatelessWidget {
  Future<List<Map<String, dynamic>>> _fetchServices() async {
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];
    final pb = PocketBase(apiUrl!);
    final response =
        await pb.collection('services').getFullList(sort: '-created');

    final List<Map<String, dynamic>> updatedServices = [];
    for (var service in response) {
      updatedServices.add({
        "color": Color(int.parse(service!.data['color'].replaceAll('#', '0xFF'))),
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
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Discover',
              style: TextStyle(
                fontSize: 25,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            SizedBox(height: 20.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'zigzag',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20.0),
            CustomGradientRectangle(
              text: 'enter spotify url on discord',
              text2: 'add song on your playlist',
            ),
            SizedBox(height: 20.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Services',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20.0),
            FutureBuilder<List<Map<String, dynamic>>>(
              future: _fetchServices(),
              builder: (context, serviceSnapshot) {
                if (serviceSnapshot.connectionState ==
                    ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (serviceSnapshot.hasError) {
                  return Center(child: Text('Error: ${serviceSnapshot.error}'));
                } else {
                  return Container(
                    height: 200,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: serviceSnapshot.data?.length ?? 0,
                      itemBuilder: (context, index) {
                        var service = serviceSnapshot.data![index];
                        return Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            height: 200,
                            child: CustomRectangle(
                              color: service["color"],
                              title: service["title"],
                              text: service["text"],
                              serviceUrl: service["credentials"],
                            ),
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
