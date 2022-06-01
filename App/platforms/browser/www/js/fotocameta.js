class Fotocamera {
	avviaCamera() {
		let opzioni = {
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.DATA_URL,
			quality: 50,
		};
		navigator.camera.getPicture(
			this.cameraSuccess.bind(this),
			this.cameraError.bind(this),
			opzioni
		);
	}
	cameraSuccess(imageData) {
		let img = document.getElementById("img");
		img.src = "data:image/jpeg;base64," + imageData;
	}
	cameraError(mesErrore) {
		alert("Errore: " + mesErrore);
	}
}
