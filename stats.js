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
    let detail=searchTool(".description").text().split(",");
    venu=detail[1].trim();
    let date=detail[2].trim();
    let result=searchTool(".match-info span");
    result=searchTool(result[result.length-1]).text();
    
    
    //team1 Name
    let t1=searchTool(teams[0]).text();
    t1Name=t1.split("INNINGS")[0].trim();

    //team2 Name
    let t2=searchTool(teams[1]).text();
    t2Name=t2.split("INNINGS")[0].trim();
    
    //team1 folder
    let t1Folder=path.join(folderPath,t1Name);
    if(fs.existsSync(t1Folder)==false){
        fs.mkdirSync(t1Folder);
    }

    //t1 players->batsman files

    let t1Players=searchTool(teams[0]).find(".table.batsman tbody tr");
    
    for(let i=0;i<t1Players.length;i++){
        let noOfTd=searchTool(t1Players[i]).find("td");
        
        let opponentTeamName=t2Name;

        if(noOfTd.length==8){
            let playerName=searchTool(noOfTd[0]).text();
            let runs=searchTool(noOfTd[2]).text();
            let balls=searchTool(noOfTd[3]).text();
            let fours=searchTool(noOfTd[5]).text();
            let sixes=searchTool(noOfTd[6]).text();
            let sr=searchTool(noOfTd[7]).text();

            let location=path.join(t1Folder,playerName+".json");

        let jsonData=contentRead(t1Name,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr);
        let jsonWrite=JSON.stringify(jsonData);
        

        if(fs.existsSync(location)==false){
            fs.writeFileSync(location,jsonWrite+",\n");
        }else{
            fs.appendFileSync(location,jsonWrite+",\n");
        }

        }
    }
    let t2Folder=path.join(folderPath,t2Name);
    if(fs.existsSync(t2Folder)==false){
        fs.mkdirSync(t2Folder);
    }

    //t2 players->batsman files

    let t2Players=searchTool(teams[1]).find(".table.batsman tbody tr");
    for(let i=0;i<t2Players.length;i++){
        let noOfTd=searchTool(t2Players[i]).find("td");
        
        let opponentTeamName=t1Name;
        
        
        if(noOfTd.length==8){
            let playerName=searchTool(noOfTd[0]).text();
            let runs=searchTool(noOfTd[2]).text();
            let balls=searchTool(noOfTd[3]).text();
            let fours=searchTool(noOfTd[5]).text();
            let sixes=searchTool(noOfTd[6]).text();
            let sr=searchTool(noOfTd[7]).text();
            let location=path.join(t2Folder,playerName+".json");

        let jsonData=contentRead(t2Name,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr);
        let jsonWrite=JSON.stringify(jsonData);

        if(fs.existsSync(location)==false){
            fs.writeFileSync(location,jsonWrite+",\n");
        }else{
            fs.appendFileSync(location,jsonWrite+",\n");
        }

        }
        
    }
}
function contentRead(t1Name,playerName,venu,date,opponentTeamName,result,runs,balls,fours,sixes,sr){
    let data={
        "myTeamName":t1Name,
        "name":playerName,
        "venu":venu ,
        "date":date,
        "opponentTeamName":opponentTeamName,
        "result":result,
        "runs":runs,
        "balls":balls,
        "fours":fours,
        "sixes":sixes,
        "sr":sr
    }
    
    return data;
}
module.exports={
    processSinglematch
}
    