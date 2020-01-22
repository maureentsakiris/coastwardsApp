{
    "main": "node_modules/expo/AppEntry.js",
    "scripts": {
        "start": "expo start",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web",
        "eject": "expo eject",
        "test": "jest --watchAll"
    },
    "jest": {
        "preset": "jest-expo"
    },
    "dependencies": {
        "@expo/react-native-action-sheet": "^3.4.1",
        "@expo/samples": "~3.0.3",
        "@expo/vector-icons": "^10.0.0",
        "@react-native-community/netinfo": "4.6.0",
        "@react-navigation/web": "^1.0.0-alpha.9",
        "expo": "^36.0.0",
        "expo-asset": "~8.0.0",
        "expo-av": "~8.0.0",
        "expo-blur": "~8.0.0",
        "expo-camera": "~8.0.0",
        "expo-constants": "~8.0.0",
        "expo-face-detector": "~8.0.0",
        "expo-font": "~8.0.0",
        "expo-image-manipulator": "~8.0.0",
        "expo-image-picker": "~8.0.1",
        "expo-intent-launcher": "~8.0.0",
        "expo-localization": "~8.0.0",
        "expo-location": "~8.0.0",
        "expo-media-library": "~8.0.0",
        "expo-permissions": "~8.0.0",
        "expo-web-browser": "~8.0.0",
        "i18n-js": "^3.5.0",
        "prop-types": "^15.7.2",
        "react": "16.9.0",
        "react-dom": "16.9.0",
        "react-native": "https://github.com/expo/react-native/archive/sdk-36.0.1.tar.gz",
        "react-native-gesture-handler": "~1.5.0",
        "react-native-reanimated": "~1.4.0",
        "react-native-safe-area-context": "0.6.0",
        "react-native-screens": "2.0.0-alpha.12",
        "react-native-swiper": "nightly",
        "react-native-web": "^0.11.7",
        "react-native-webview": "7.4.3",
        "react-navigation": "^4.0.10",
        "react-navigation-animated-switch": "^0.4.0",
        "react-navigation-backhandler": "^1.3.2",
        "react-navigation-drawer": "^2.3.3",
        "react-navigation-stack": "^1.10.3",
        "react-navigation-tabs": "^2.6.0",
        "uuid": "^3.3.3",
        "expo-sensors": "~8.0.0"
    },
    "devDependencies": {
        "babel-preset-expo": "^8.0.0",
        "eslint-plugin-prettier": "^3.1.0",
        "jest-expo": "^36.0.0",
        "babel-eslint": "^10.0.2",
        "eslint": "^6.1.0",
        "eslint-config-airbnb": "^17.1.1",
        "eslint-config-prettier": "^6.0.0",
        "eslint-plugin-babel": "^5.3.0",
        "eslint-plugin-import": "^2.18.2",
        "eslint-plugin-jsx-a11y": "^6.2.3",
        "eslint-plugin-react": "^7.14.3",
        "eslint-plugin-react-hooks": "^1.6.1",
        "prettier": "1.18.2"
    },
    "private": true
}


selectMe = () => {
    const { asset, onSelect } = this.props
    const { selected, fetched, assetLocation, assetExif } = this.state

    if (!fetched) {
      this.setState({ fetching: true })
      MediaLibrary.getAssetInfoAsync(asset)

        .then(result => {
          this.setState({ fetched: true })

          const { location, exif } = result
          if (!location) {
            this.setState({ blocked: true })
          } else {
            this.setState({ selected: !selected, assetLocation: location, assetExif: exif })
            onSelect({ asset, location, exif })
          }
          this.setState({ fetching: false })
        })
        .catch(error => {
          alert(error)
        })
    } else {
      this.setState({ selected: !selected })
      onSelect({ asset, assetLocation, assetExif })
    }
  }



  // const getAssetInfo = asset => {
  //  return new Promise((resolve, reject) => {
  //    const { id } = asset

  //    const newSelected = new Map(selected)
  //    newSelected.set(id, 'fetching')
  //    // setSelected(newSelected)

  //    MediaLibrary.getAssetInfoAsync(asset)
  //      .then(result => {
  //        const { location, exif } = result
  //        if (location) {
  //          resolve(result)
  //        } else {
  //          resolve(false)
  //        }
  //      })
  //      .catch(error => {
  //        reject(error)
  //      })
  //  })
  // }

  // const onSelect = useCallback(asset => {
  //  const { id } = asset
  //  const newSelected = new Map(selected)
  //  const info = newSelected.get(id)

  //  if (!info) {
  //    // newSelected.set(id, 'fetching')
  //    getAssetInfo(asset)
  //      .then(assetInfo => {
  //        if (assetInfo) {
  //          const { uri, exif, location } = assetInfo
  //          // newSelected.clear() // <--- Remove when implementing multiple selects
  //          newSelected.set(id, { status: 'selected', id, uri, exif, location })
  //        } else {
  //          newSelected.set(id, 'blocked')
  //        }

  //        // setSelected(newSelected)
  //      })
  //      .catch(error => alert(error))
  //  } else {
  //    const { status } = info
  //    if (status === 'selected') {
  //      newSelected.set(id, { status: 'deselected' })
  //    } else {
  //      const { uri, exif, location } = info
  //      newSelected.set(id, { status: 'selected', id, uri, exif, location })
  //    }
  //    // setSelected(newSelected)
  //  }
  // })











const { width } = Dimensions.get('window')
const THIRD = width / 4 - 4

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
  },
  image: {
    width: THIRD,
    height: THIRD,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    opacity: 0.05,
  },
  activityView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    width: THIRD,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkView: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  check: {
    opacity: 1,
  },
})

const Asset = ({ asset, onSelect }) => {
  const { uri, id } = asset
  const [showAssetAlert, setShowAssetAlert] = useState(true)
  const [selected, setSelected] = useState(false)

  const isSafe = useRef(true)

  // setting states after asynchronous calls was causing memory leak. calls cannot be wrapped into an effect because they are not called onMount but when user clicks btn
  // https://jeffchheng.github.io/brains-base/2019-08-02-usestatesafely/?utm_campaign=Week%20of%20React&utm_medium=email&utm_source=Revue%20newsletter
  useEffect(() => {
    // Future proofing for double-invoking
    // effects in Strict Mode.
    isSafe.current = true
    return () => {
      isSafe.current = false
    }
  }, [])

  const [fetching, setFetching] = useState(null)
  const [valid, setValid] = useState(null)
  const [fetched, setFetched] = useState(false)

  const selectMe = () => {
    if (!fetched) {
      setFetching(true)
      // alert(JSON.stringify(asset))
      MediaLibrary.getAssetInfoAsync(asset)

        .then(result => {
          const { location } = result

          if (isSafe.current) {
            setFetching(false)
            setFetched(true)

            if (location) {
              setValid(true)
              setSelected(true)
              onSelect(id)
            } else {
              setValid(false)

              if (showAssetAlert) {
                Alert.alert(
                  I18n.t('image_not_valid'),
                  I18n.t('location_undefined_app'),
                  [
                    {
                      text: I18n.t('ok'),
                      style: 'cancel',
                    },
                  ],
                  { cancelable: false } // Don't allow to cancel by tapping outside
                )
              }
            }
          }
        })
        .catch(error => {
          alert(error)
        })
    } else if (valid) {
      onSelect(id)
      setSelected(!selected)
    }
  }

  return (
    <TouchableOpacity
      style={styles.view}
      onPress={() => {
        selectMe()
      }}
      activeOpacity={1}
      disabled={fetching}
    >
      <ImageBackground source={{ uri }} style={styles.image} imageStyle={{ opacity: !valid && fetched ? 0.1 : 1 }}>
        {fetching && (
          <View style={styles.activityView} pointerEvents="none">
            <ActivityIndicator style={styles.activity} size="large" color="white" />
          </View>
        )}
        {valid === false && <MaterialIcons name="block" size={40} color="black" style={styles.block} />}
        {selected && (
          <View style={styles.checkView} pointerEvents="none">
            <MaterialIcons name="check-circle" size={40} color={theme.primary} style={styles.check} />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  )
}

Asset.defaultProps = {
  selected: false,
}

Asset.propTypes = {
  asset: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default Asset



<Asset asset={item} onSelect={onSelect} selected={isSelected} />


<ScrollView style={styles.safeAreaView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} persistentScrollbar inverted />}>
        <View style={styles.thumbs}>{thumbs}</View>
      </ScrollView>

const thumbs = assetsToShow.map(asset => {
    const { id } = asset
    return <Asset key={id} asset={asset} />
  })


MediaLibrary.getAssetInfoAsync(asset)
      .then(result => {
        alert(JSON.stringify(result))
      })
      .catch(error => {
        alert(error)
      })



const openImagePicker = () => {
    const options = {}

    ImagePicker.launchImageLibraryAsync(options)
      .then(result => {
        alert(JSON.stringify(result))
        return result
      })
      .catch(error => {
        alert(error)
      })
  }

  const checkLocationServicesPermission = () => {
    return new Promise((resolve, reject) => {
      Location.hasServicesEnabledAsync()
        .then(status => {
          switch (status) {
            case true:
              resolve(status)
              break
            case false:
              resolve(status)
              break
            default:
              reject(status)
              break
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  const checkLocationPermission = () => {
    return new Promise((resolve, reject) => {
      const askLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION)
        return status
      }

      askLocationPermission()
        .then(status => {
          switch (status) {
            case 'granted':
              resolve(status)
              break
            case 'denied':
              resolve(status)
              break
            case 'undetermined':
              resolve(status)
              break
            default:
              reject(status)
              break
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  const checkCameraPermission = () => {
    return new Promise((resolve, reject) => {
      const askCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        return status
      }

      askCameraPermission()
        .then(status => {
          switch (status) {
            case 'granted':
              resolve(status)
              break
            case 'denied':
              resolve(status)
              break
            case 'undetermined':
              resolve(status)
              break
            default:
              reject(status)
              break
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const checkPermissionsCamera = () => {
    const results = []
    // Only breacking permissions
    checkLocationServicesPermission()
      .then(val => {
        results[0] = val
        return checkLocationPermission()
      })
      .then(val => {
        results[1] = val
        return checkCameraPermission()
      })
      .then(val => {
        results[2] = val

        // const resultsMsg = `Location Services are on: ${results[0]}\nPermission to access location: ${results[1]}\nPermission to use camera: ${results[2]}`

        let resultsMsg = results[0] ? '' : 'Location Services\n'
        resultsMsg += results[1] === 'granted' ? '' : 'Location\n'
        resultsMsg += results[2] === 'granted' ? '' : 'Camera\n'

        if (results.includes(false) || results.includes('denied')) {
          Alert.alert(
            I18n.t('permissions_missing_title'),
            `\n${I18n.t('permissions_missing_msg')}\n\n${resultsMsg}\n`,
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
        } else {
          alert('Permissions in order: get location, take picture and proceed to contribute screen')
          // navigation.navigate('Contribute')
        }
        return true
      })
      .catch(error => {
        alert(error)
      })
  }

  const checkPermissionsPhotoLibrary = () => {
    ImagePicker.getCameraRollPermissionsAsync()
      .then(result => {
        const { status, canAskAgain, expires, granted } = result
        switch (status) {
          case 'granted':
            alert('granted: move on')
            break
          case 'denied':
            alert('denied: ask again')
            break
          case 'undetermined':
            alert('undetermined: ask')
            break
          default:
            alert('default: ask')
            break
        }
      })
      .catch(error => {
        alert(error)
      })
  }














<Ionicons onPress={() => Linking.openURL('https://www.facebook.com/coastwards/')} style={styles.socialIcon} size={30} name="logo-instagram" color={theme.waterMap} />


<View style={styles.videoView}>
          <VideoPlayer
            videoProps={{
              shouldPlay: false,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: video,
            }}
            inFullscreen={false}
          />
        </View>


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





