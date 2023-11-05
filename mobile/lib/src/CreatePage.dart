// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pocketbase/pocketbase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/Component/CardComponent.dart';

class CreatePage extends StatefulWidget {
  @override
  _CreatePageState createState() => _CreatePageState();
}

class ServiceChoice {
  final Color color;
  final String name;
  final String description;
  final String service_id;

  ServiceChoice({
    required this.color,
    required this.name,
    required this.description,
    required this.service_id,
  });
}

class ZagChoice {
  final String nameZag;
  final String descriptionZag;
  final String service_id;

  ZagChoice({
    required this.nameZag,
    required this.descriptionZag,
    required this.service_id,
  });
}

class _CreatePageState extends State<CreatePage> {
  ServiceChoice? selectedService;
  ZagChoice? selectedZag;
  late List<bool> isSelectedList;

  _CreatePageState() {
    selectedService = null;
    selectedZag = null;
  }

  int _currentStep = 0;
  Future<List<Map<String, dynamic>>> ? _servicesFuture;
  Future<List<Map<String, dynamic>>> ?  _zagsFuture;

  @override
  void initState() {
    super.initState();
    _zagsFuture = _fetchZag();
    _servicesFuture = _fetchZig();
    isSelectedList = List.filled(100, false);
  }


  Future<List<Map<String, dynamic>>> _fetchZig() async {
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];
    final pb = PocketBase(apiUrl!);
    final response =
        await pb.collection('zig').getFullList(sort: '-created');

    final List<Map<String, dynamic>> updatedServices = [];
    for (var service in response) {
      updatedServices.add({
        //"color": Color(int.parse(service!.data['color'].replaceAll('#', '0xFF'))),
        "name": service!.data['name'],
        "description": service!.data['description'],
        "service_id": service!.data['service_id'],
      });
    }

    return updatedServices;
  }

  Future<List<Map<String, dynamic>>> _fetchZag() async {
    await dotenv.load();
    final apiUrl = dotenv.env['API_URL'];
    final pb = PocketBase(apiUrl!);
    final response =
        await pb.collection('zag').getFullList(sort: '-created');

    final List<Map<String, dynamic>> updatedZags = [];
    for (var zag in response) {
      updatedZags.add({
        "name": zag!.data['name'],
        "description": zag!.data['description'],
        "service_id": zag!.data['service_id'],
      });
    }

    return updatedZags;
  }

  @override
  Widget build(BuildContext context) {
    List<Step> steps = [
      Step(
        title: Text('Step 1'),
        content: FutureBuilder<List<Map<String, dynamic>>>(
          future: _servicesFuture,
          builder: (context, serviceSnapshot) {
            if (serviceSnapshot.connectionState == ConnectionState.waiting) {
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
                      child: CustomRectangle(
                        name: service["name"],
                        showButton: false,
                        description: service["description"],
                        serviceUrl: service["credentials"],
                        isSelected : isSelectedList[index],
                        onSelectService: () {
                          if (_currentStep == 0) {
                            setState(() {
                              for (var i = 0; i < isSelectedList.length; i++) {
                                isSelectedList[i] = (i == index);
                              }
                              selectedService = ServiceChoice(
                                color: isSelectedList[index] ? Colors.grey : Colors.white,
                                name: service["name"],
                                description: service["description"],
                                service_id: service["service_id"],
                              );
                              print("Service sélectionné : ${selectedService?.name}");
                            });
                          }
                        },
                      ),
                    );
                  },
                ),
              );
            }
          },
        ),
      ),
      Step(
        title: Text('Step 2'),
        content: FutureBuilder<List<Map<String, dynamic>>>(
          future: _zagsFuture,
          builder: (context, zagSnapshot) {
            if (zagSnapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (zagSnapshot.hasError) {
              return Center(child: Text('Error: ${zagSnapshot.error}'));
            } else {
              return Container(
                height: 200,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: zagSnapshot.data?.length ?? 0,
                  itemBuilder: (context, index) {
                    var zag = zagSnapshot.data![index];
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: CustomRectangle(
                        name: zag["name"],
                        showButton: false,
                        description: zag["description"],
                        serviceUrl: zag["credentials"],
                        isSelected : isSelectedList[index],
                        onSelectService: () {
                          if (_currentStep == 1) {
                            setState(() {
                              for (var i = 0; i < isSelectedList.length; i++) {
                                isSelectedList[i] = (i == index);
                              }
                              selectedZag = ZagChoice(
                                nameZag: zag["name"],
                                descriptionZag: zag["description"],
                                service_id: zag["service_id"],
                              );
                              print("Zag sélectionné : ${selectedZag?.nameZag}");
                            });
                          }
                        },
                      ),
                    );
                  },
                ),
              );
            }
          },
        ),
      ),
      Step(
        title: Text('Step 3'),
        content: Text('Your content for Step 3 goes here.'),
      ),
      Step(
        title: Text ('Step 4'),
        content: Text('')
      ),
      // Add more steps as needed
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFE8E0D9),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.only(left: 16.0, top: 16.0),
            child: Text(
              'Create Action',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
          ),
          Stepper(
            currentStep: _currentStep,
            onStepTapped: (step) {
              setState(() {
                _currentStep = step;
              });
            },
            steps: steps,
            controlsBuilder: (BuildContext context, ControlsDetails controls) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  if (_currentStep > 0)
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _currentStep -= 1;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        primary: Colors.grey,
                      ),
                      child: const Text('Back'),
                    ),
                  if (_currentStep < steps.length - 1)
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _currentStep += 1;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        primary: Colors.blue,
                      ),
                      child: const Text('Next'),
                    ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

void main() => runApp(MaterialApp(home: CreatePage()));