<View style={styles.videoView}>
        <Video style={styles.video} useNativeControls source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }} rate={1.0} volume={1.0} isMuted={false} resizeMode="cover" shouldPlay={false} isLooping />
      </View>

<TouchableOpacity style={styles.refresh}>
          <MaterialIcons
            name="refresh"
            size={40}
            color={theme.primary}
            onPress={() => {
              navigation.openDrawer()
            }}
          />
        </TouchableOpacity>


<WebView style={styles.webviewInner} source={{ uri: 'http://192.168.0.6:8888/map' }} />

<SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.Os === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100} enabled>
        <ScrollView>
          <Image style={styles.picture} source={{ uri: picture.uri }} />
          <View style={styles.formContainer}>
            <Text style={styles.hurray}>{I18n.t('hurray')}</Text>
            <Text style={styles.hurraySubtitle}>{I18n.t('select_material')}</Text>
            <View style={styles.materialBtnsContainer}>{materialBtns}</View>
            <Text style={styles.hurraySubtitle}>{I18n.t('comment')}</Text>
            <TextInput
              style={styles.comment}
              onChangeText={txt => {
                setCommentUser(txt)
              }}
              value={commentUser}
              placeholder={I18n.t('comment_placeholder')}
              multiline
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>



{!picture && (
          <Camera
            style={styles.camera}
            type="back"
            ref={ref => {
              setCameraRef(ref)
            }}
            onCameraReady={() => {
              setupCamera()
            }}
            onMountError={error => {
              Alert.alert(
                I18n.t('something_went_wrong'),
                error.message,
                [
                  {
                    text: I18n.t('cancel'),
                    style: 'cancel',
                    onPress: () => {
                      navigation.navigate('Main')
                    },
                  },
                ],

                { cancelable: false } // Don't allow to cancel by tapping outside
              )
            }}
            ratio={ratio}
          />
        )}
        {picture && <Image style={styles.picture} source={{ uri: picture.uri }} />}


useEffect(() => {
  async function fetchGotItStorage() {
    return AsyncStorage.getItem('GOTIT')
  }

  fetchGotItStorage()
    .then(value => {
      let val
      switch (value) {
        case null:
          val = true
          break
        case 'false':
          val = true
          break
        case 'true':
          val = false
          break
        default:
          val = true
          break
      }
      navigation.navigate('Guidelines')
      return val
    })
    .catch(error => {
      Alert.alert(error)
    })
}, [])


<TouchableOpacity style={styles.cancelBtn}>
            <Text
              onPress={() => {
                navigation.navigate('Main')
              }}
              style={styles.cancelBtnTxt}
            >
              {I18n.t('cancel')}
            </Text>
          </TouchableOpacity>


{picture && <Text>Width: {picture.width}</Text>}
{picture && <Text>Height: {picture.height}</Text>}
{picture && <Text>{JSON.stringify(picture.exif)}</Text>}

{location && (
  <View>
    <Text>latitude: {location.coords.latitude}</Text>
    <Text>
      longitude: {location.coords.longitude} accuracy: {location.coords.accuracy} heading: {location.coords.heading}
    </Text>
    <Text>
      accuracy: {location.coords.accuracy} heading: {location.coords.heading}
    </Text>
    <Text>heading: {location.coords.heading}</Text>
  </View>
)}


<WebView style={styles.webviewInner} source={{ uri: 'http://coastwards.org/map' }} />

<TouchableOpacity  style={styles.button} >
  			<Text style={styles.buttonText} >Take a picture</Text>
  		</TouchableOpacity>




	/*const [ counter, setCounter ] = useState(0)
	const [ refreshing, setRefreshing ] = useState(false)

	const refresh = () => {

		setRefreshing(true)
		setRefreshing( false )
		setCounter( counter + 1 )

	}*/


    "locales": {
      "en": {
        "description": "Help Science study the risks of sea-level rise by uploading pictures of coasts.",
        "NSCameraUsageDescription": "Allow Coastwards to use your Camera to take pictures of coasts."
      },
      "de": {
        "description": "Hilf der Wissenschaft die Risiken des Meeresspiegelanstiegs einzuschätzen, indem Du Fotos von Küsten hochlädst.",
        "NSCameraUsageDescription": "Erlaube den Zugriff auf Deine Kamera, um Fotos von Küsten hochzuladen."
      }
    },


      		const checkLocationPermission = () => {

      		  	return new Promise( ( resolve, reject ) => {

      		  		async function askLocationPermission () {
      		  			const { status } = await Permissions.askAsync(Permissions.LOCATION)
      		  			return status
      		  		}

      				askLocationPermission()
      				.then( (status) => {
      				  switch ( status ){
      					case 'granted':
      						setLocationPermission(status === 'granted')
      						resolve( status )
      						break;
      					case 'denied':
      						reject( status )
      					  	break;
      					default:
      					  	reject( status )
      					  	break; 
      				  }
      				  
      				})
      				.catch( (error) =>  {

      					reject( error )

      				})

      			}

      		}

      		const checkCameraPermission = () => {

      		  	return new Promise( ( resolve, reject ) => {

      		  		async function askCameraPermission (){
      		  			const { status } = await Permissions.askAsync(Permissions.CAMERA)
      		  			return status
      		  		}

      				askLocationPermission()
      				.then( (status) => {
      				  switch ( status ){
      					case 'granted':
      						setCameraPermission(status === 'granted')
      						resolve( status )
      						break;
      					case 'denied':
      						reject( status )
      					  	break;
      					default:
      					  	reject( status )
      					  	break; 
      				  }
      				  
      				})
      				.catch( (error) =>  {

      					reject( error )

      				})

      			}

      		}


    		Promise.all([checkLocationPermission, checkCameraPermission])
    		.then( (values) => {
    	  		alert(values);
    		})
    		.catch( (error) => {
    			alert(error)
    		});


    Alert.alert(
					I18n.t('location_denied_title'),
					I18n.t('location_denied_msg'),
					[
				  {
					text: I18n.t('cancel'),
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				  },
				  { text: I18n.t('open_settings'), onPress: () => {

					  if(Platform.OS === 'ios'){

						  Linking.openURL('app-settings:')

					  }else{

						IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS); 

					  }


				  } },
				],
				{ cancelable: false }
			  );



  /*useEffect(  () => {

	async function checkCameraPermission (){
	   const { status } = await Permissions.askAsync(Permissions.CAMERA)
	   return status
	}

	checkCameraPermission()
	.then( (status) => {

	  switch ( status ){
		case 'granted':
		  setCameraPermission(status === 'granted')
		  break;
		case 'denied':
		  Alert.alert(
			I18n.t('camera_denied_title'),
			I18n.t('camera_denied_msg'),
			[
			  {
				text: I18n.t('cancel'),
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			  },
			  { text: I18n.t('open_settings'), onPress: () => {

				  if(Platform.OS === 'ios'){

					  Linking.openURL('app-settings:')

				  }else{

					IntentLauncher.startActivityAsync(IntentLauncher.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS);

				  }


			  } },
			],
			{ cancelable: false }
		  );
		  break;
		default:
		  navigation.goBack()
		  break; 
	  }
	  
	})
	.catch( (error) =>  {

	  alert( JSON.stringify(error) )

	})

  }, [] )*/




	/*navigator.geolocation.getCurrentPosition( ( position ) => {

	  alert( position.coords.latitude )

	}, {
	  enableHighAccuracy: true,
	  timeout: 2000,
	  maximumAge: 1000
	})*/

  

  /*state = {
	hasCameraPermission: null,
	type: Camera.Constants.Type.back,
  };
*/
  /*async componentDidMount() {
	const { status } = await Permissions.askAsync(Permissions.CAMERA);
	this.setState({ hasCameraPermission: status === 'granted' });
  }*/



  "locales": {
    "en": "./i18n/locales/ios/en.json",
    "de": "./i18n/locales/ios/de.json",
    "es": "./i18n/locales/ios/es.json",
    "fr": "./i18n/locales/ios/fr.json",
    "pt": "./i18n/locales/ios/pt.json",
    "ar": "./i18n/locales/ios/ar.json",
    "zh": "./i18n/locales/ios/zh.json",
    "el": "./i18n/locales/ios/el.json",
    "hi": "./i18n/locales/ios/hi.json",
    "it": "./i18n/locales/ios/it.json",
  }


  <Camera style={styles.camera} type="back">
				
			</Camera>




checkLocationServicesPermission()
      
      // .then(() => {
      //  if (Platform.OS === 'android') {
      //    return checkProviderStatusAsync()
      //  }
      //  return true
      // })
      
      .then(() => {
        return checkLocationPermission()
      })
      .then(() => {
        return checkCameraPermission()
      })
      .then(() => {
        navigation.navigate('Modal')
        return true
      })
      .catch(error => {
        Alert.alert(
          I18n.t('permissions_missing_title'),
          `${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
          [
            {
              text: I18n.t('ok'),
              style: 'cancel',
            },
            {
              text: I18n.t('open_settings'),
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:')
                } else {
                  // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                  IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                }
              },
              style: 'cancel',
            },
          ],
          { cancelable: false } // Don't allow to cancel by tapping outside
        )

        /*
        if (error === 'location_services_denied') {
          Alert.alert(
            I18n.t('locationservices_denied_title'),
            `${I18n.t('locationservices_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('ok'),
                style: 'cancel',
              },
              
              // {
              //  text: I18n.t('open_settings'),
              //  onPress: () => {
              //    if (Platform.OS === 'ios') {
              //      Linking.openURL('prefs:')
              //    } else {
              //      IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS)
              //    }
              //  },
              //  style: 'cancel',
              // },
              
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else if (error === 'location_permission_denied') {
          Alert.alert(
            I18n.t('location_denied_title'),
            `${I18n.t('location_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('cancel'),
                style: 'cancel',
              },
              {
                text: I18n.t('open_settings'),
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:')
                  } else {
                    // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                    IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                  }
                },
                style: 'cancel',
              },
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else if (error === 'camera_permission_denied') {
          Alert.alert(
            I18n.t('camera_denied_title'),
            `${I18n.t('camera_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('cancel'),
                style: 'cancel',
              },
              {
                text: I18n.t('open_settings'),
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:')
                  } else {
                    // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                    IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                  }
                },
                style: 'cancel',
              },
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else {
          alert(error)
        }
        */
      })

// .then(() => {
      //  if (Platform.OS === 'android') {
      //    return checkProviderStatusAsync()
      //  }
      //  return true
      // })

const checkProviderStatusAsync = () => {
    return new Promise((resolve, reject) => {
      Location.getProviderStatusAsync()
        .then(status => {
          const { networkAvailable } = status
          switch (networkAvailable) {
            case true:
              resolve(networkAvailable)
              break
            case false:
              return networkAvailable
            default:
              reject(networkAvailable)
              break
          }
          return status
        })
        .then(() => {
          return Location.enableNetworkProviderAsync()
        })
        // this is already returned above
        /*
        .then(status => {
          switch (status) {
            case true:
              resolve(status)
              break
            case false:
              reject(status)
              break
            default:
              reject(status)
              break
          }
        })
        */
        .catch(error => {
          reject(error)
        })
    })
  }



Promise.all([Location.hasServicesEnabledAsync(), Permissions.askAsync(Permissions.LOCATION), Permissions.askAsync(Permissions.CAMERA)])
      .then(values => {
        alert(values)
      })
      .catch(error => {
        alert(values)
      })
  }




/*Alert.alert(
          I18n.t('permissions_missing_title'),
          `${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
          [
            {
              text: I18n.t('ok'),
              style: 'cancel',
            },
            {
              text: I18n.t('open_settings'),
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:')
                } else {
                  // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                  IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                }
              },
              style: 'cancel',
            },
          ],
          { cancelable: false } // Don't allow to cancel by tapping outside
        )*/

        /*
        if (error === 'location_services_denied') {
          Alert.alert(
            I18n.t('locationservices_denied_title'),
            `${I18n.t('locationservices_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('ok'),
                style: 'cancel',
              },
              
              // {
              //  text: I18n.t('open_settings'),
              //  onPress: () => {
              //    if (Platform.OS === 'ios') {
              //      Linking.openURL('prefs:')
              //    } else {
              //      IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS)
              //    }
              //  },
              //  style: 'cancel',
              // },
              
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else if (error === 'location_permission_denied') {
          Alert.alert(
            I18n.t('location_denied_title'),
            `${I18n.t('location_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('cancel'),
                style: 'cancel',
              },
              {
                text: I18n.t('open_settings'),
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:')
                  } else {
                    // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                    IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                  }
                },
                style: 'cancel',
              },
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else if (error === 'camera_permission_denied') {
          Alert.alert(
            I18n.t('camera_denied_title'),
            `${I18n.t('camera_denied_msg')} \n\n ${I18n.t('permissions_missing_msg')} \n\n Error: ${error}`,
            [
              {
                text: I18n.t('cancel'),
                style: 'cancel',
              },
              {
                text: I18n.t('open_settings'),
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:')
                  } else {
                    // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS)
                    IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS)
                  }
                },
                style: 'cancel',
              },
            ],
            { cancelable: false } // Don't allow to cancel by tapping outside
          )
        } else {
          alert(error)
        }
        */








const [userLocation, setUserLocation] = useState(null)

  const getUserPosition = () => {
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      .then(value => {
        alert(JSON.stringify(value))
        setUserLocation(value)
        return value
      })
      .catch(error => {
        Alert.alert(error)
      })
  }


<TouchableOpacity
            onPress={() => {
              setShowGuidelines(false)
            }}
          >
            <Text style={styles.gotItBtn}>{I18n.t('got_it')}</Text>
          </TouchableOpacity>
          <View style={styles.dontShowAgain}>
            <MaterialIcons
              name={isChecked ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={theme.primary}
              onPress={() => {
                toggleGotIt(!isChecked)
              }}
            />
            <Text style={styles.dontShowAgainTxt}>{I18n.t('do_not_show_again')}</Text>
          </View>






<Guidelines style={{ ...styles.guidelines, display: showGuidelines ? 'flex' : 'none' }} onDismiss={() => setShowGuidelines(false)} />



<Swiper style={styles.swiper} showsButtons={false} activeDotColor={theme.primary} loop={false}>
        <View style={styles.slide}>
          <Image source={anycoast} style={styles.icon} />
          <Text style={styles.slideTitle}>{I18n.t('any_picture')}</Text>
          <Text style={styles.slideText}>{I18n.t('any_coast')}</Text>
        </View>
        <View style={styles.slide}>
          <Image source={nofaces} style={styles.icon} />
          <Text style={styles.slideTitle}>{I18n.t('guideline_faces_header')}</Text>
          <Text style={styles.slideText}>{I18n.t('guideline_faces_text')}</Text>
        </View>
        <View style={styles.slide}>
          <Image source={coastmaterial} style={styles.icon} />
          <Text style={styles.slideTitle}>{I18n.t('guideline_material_header')}</Text>
          <Text style={styles.slideText}>{I18n.t('guideline_material_text')}</Text>
        </View>
        <View style={styles.slide}>
          <Image source={notonlybeaches} style={styles.icon} />
          <Text style={styles.slideTitle}>{I18n.t('guideline_coasts_header')}</Text>
          <Text style={styles.slideText}>{I18n.t('guideline_coasts_text')}</Text>
        </View>
        <View style={styles.slide}>
          <Image source={closeup} style={styles.icon} />
          <Text style={styles.slideTitle}>{I18n.t('guideline_closer_header')}</Text>
          <Text style={styles.slideText}>{I18n.t('guideline_closer_text')}</Text>
        </View>
      </Swiper>





