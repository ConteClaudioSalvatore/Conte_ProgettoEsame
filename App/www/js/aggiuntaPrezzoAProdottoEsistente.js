function aggiungiPrezzo(barcode, prezzo, supermercato){
    $.ajax({
        url: "https://claudioconte.altervista.org/api/aggiungiProdottoASupermercato.php",
        method: "post",
        data: {
            barcode: barcode,
            prezzo: prezzo,
            supermarket: supermercato
        },
        success: function(data){
            if(data.err == -1){
                console.log("prezzo aggiunto con successo");
                $("#dialogAggiuntaPrezzo").modal("hide");
                
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}