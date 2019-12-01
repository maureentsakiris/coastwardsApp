<WebView style={styles.webview} source={{ uri: 'http://coastwards.org/map' }}  />
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











































