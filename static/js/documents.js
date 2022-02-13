const documents = {
    func: {
        query:function(){
            $.get("/documents").done(function(data){
                console.log(data)
            })
        }
    }
}