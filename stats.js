let fs=require("fs");
let path=require("path");

let request=require("request");
let cheerio=require("cheerio");

function processSinglematch(url){
    request(url,cb3);

}

function cb3(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        getStats(html);
    }
}

function getStats(html){
    let searchTool=cheerio.load(html);
    //ipl folder
    let folderPath=path.join("C:\\Users\\omansh\\Desktop\\cricInfo\\"+"ipl");
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }

    let teams=searchTool(".Collapsible");
    
    //team1 folder
    let t1=searchTool(teams[0]).text();
    t1Name=t1.split("INNINGS")[0].trim();

    
    let t1Folder=path.join(folderPath,t1Name);
    if(fs.existsSync(t1Folder)==false){
        fs.mkdirSync(t1Folder);
    }

    //t1 players->batsman files

    let t1Players=searchTool(teams[0]).find(".table.batsman tbody tr .batsman-cell");
    
    for(let i=0;i<t1Players.length;i++){
        let playerName=searchTool(t1Players[i]).find("a").text();
        let location=path.join(t1Folder,playerName);

        if(fs.existsSync(location)==false){
            fs.writeFileSync(location,"done");
        }
            

    }

    //team2 folder
    let t2=searchTool(teams[1]).text();
    t2Name=t2.split("INNINGS")[0].trim();
    
    
    let t2Folder=path.join(folderPath,t2Name);
    if(fs.existsSync(t2Folder)==false){
        fs.mkdirSync(t2Folder);
    }

    //t2 players->batsman files

    let t2Players=searchTool(teams[1]).find(".table.batsman tbody tr .batsman-cell");
    for(let i=0;i<t2Players.length;i++){
        let playerName=searchTool(t2Players[i]).find("a").text();

        let location=path.join(t2Folder,playerName);
        
        if(fs.existsSync(location)==false){
            fs.writeFileSync(location,"done");
        }

    }

}
module.exports={
    processSinglematch
}