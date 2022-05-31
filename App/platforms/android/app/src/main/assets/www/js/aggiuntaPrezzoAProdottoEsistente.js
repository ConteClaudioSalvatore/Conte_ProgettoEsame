function aggiungiPrezzo(modalBody, dataProd, barcode, prezzo, supermercato){
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
                creaBodyProdotto(modalBody, dataProd);
                $("#modal").modal("show");
            }
        },
        error: function(error){
            $("#dialogAggiuntaPrezzo").modal("hide");
            creaBodyProdotto(modalBody, dataProd);
            $("#modal").modal("show");
            console.log(error);
        }
    })
}