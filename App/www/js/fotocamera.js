class Fotocamera {
	static avviaCamera(callbackSuccess = (dataImg)=>{}, callBackError = (error)=>{console.log(error)}) {
		let opzioni = {
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.DATA_URL,
			quality: 50,
		};
		navigator.camera.getPicture(
			callbackSuccess,
			callBackError,
			opzioni
		);
	}
}
