/**
 * Created by michaelcrabb on 05/03/2017.
 */

var bgcolour="\#fdfdfd"; 
 var linkcolour="\#008070"; 
 var bibcolour="\#505050"; 



function createORCIDProfile(orcidID, elementID) {

var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/works";

    fetch(ORCIDLink,

        {
            headers: {
                "Accept": "application/orcid+json"
            }
        })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function (data) {

                    ////DEBUG!
                    console.log(data);

                    var output = "<table>";
                    for (var i in data.group) {
                        //PAPER NAME
                        if (data.group[i]["work-summary"]["0"].title.title.value != null) {
                            var publicationName = data.group[i]["work-summary"]["0"].title.title.value;
                        }


                        //PUBLICATION YEAR
                        if (data.group[i]["work-summary"]["0"]["publication-date"] != null) {
                            var publicationYear = data.group[i]["work-summary"]["0"]["publication-date"].year.value;
                        }
                        else {
                            var publicationYear = "";
                        }

                        //DOI REFERENCE
                        if (data.group[i]["external-ids"]["external-id"]["length"] != 0) {
                            var doiReference = data.group[i]["external-ids"]["external-id"]["0"]["external-id-value"];
                            var doiType = data.group[i]["external-ids"]["external-id"]["0"]["external-id-type"];
                            var urltrunk= "";
                            if (doiType=="doi") {
                             urltrunk= "https://doi.org/";
                             }
                            if (doiType=="arxiv") {
                             urltrunk= "https://arxiv.org/abs/";
                             }
                            if (doiType=="isbn") {
                             doiReference= data.group[i]["external-ids"]["external-id"]["0"]["external-id-url"].value;
                             }
                             
                         }
                        else {
                            var doiReference = "";
                        }
                        
                   // var putcode=data.group[i]["work-summary"]["0"]["put-code"];

                    //    if (datadata.group[i]["work"]["0"]["citation"] != null) {
                    //        var bibtex = data["citation"]["citation-value"];
                   // }
                   // else {
                   // var bibtex = "";
                   // }
                    




                        //JOURNAL NAME
                        var putcode = data.group[i]["work-summary"]["0"]["put-code"];
                        //console.log(journalTitle);

                        //output += "<p><span id='publication_" + i + "'><i>" + publicationName + "</i>";
                        //output += " (" + publicationYear + ") </em></span>";
                        //output += " <a href='https://doi.org/" + doiReference + "'> " + doiReference + "</a></p>";
                        
                        //output += "<p>";
                       if (publicationYear>2006){
                        output += "<tr><td>";
                        if (publicationYear>2006 && doiReference.length > 0){
                          output += "<span  style=\"font-size:70\%\" id='bibtex_" + i + "'></span>";
                          output += "</td><td></td><td>";
                          output += "<span id='contributors_" + i + "'></span><span id='publication_" + i + "'>"+"<a href='"+ urltrunk + doiReference + "'>";
                          output += "<b><i>" + publicationName + "</i></b></a>";
                        } else {
                          output += "<span  style=\"font-size:70\%\; color:"+bgcolour+"\" id='bibtex_" + i + "'></span>";
                          output += "</td><td></td><td>";
                          output += "<span id='contributors_" + i + "'></span><span id='publication_" + i + "'>";
                          output += "<b><i>" + publicationName + "</i></b>";
                        }
                        output += "</span>";
                        //output += " (" + publicationYear + ") </span> ";
                        //if (bibtex != "") {
                         //output += '\<span style=\"font-size:70\%\">\[';
                         //output +=  fancylink('BibTeX','javascript\:var myWindow = window.open\(\'\',\'\_blank\'\)\;myWindow\.document\.write\(\''+bibtex+'\'\);','',linkcolour,bibcolour);
                         //output +='\] <\/span>';  
                        // }
                        output += ", " + publicationYear +"."
                        //output += "</p>";
                        output += "</td></tr>";
                        getJournalTitle(orcidID, putcode, i);
                        getbib(orcidID, putcode, i,publicationYear>2006  && doiReference.length > 0);
                       }
 
                    }

                    //output += "</ul>";
                    output += "</table>";
                    document.getElementById(elementID).innerHTML = output;
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function getJournalTitle(orcidID, putcode, i) {
    var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/work/" + putcode;
    fetch(ORCIDLink,
        {
            headers: {
                "Accept": "application/orcid+json"
            }
        })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                     if (data["short-description"] != null) {
                        var output = data["short-description"];
                        document.getElementById("contributors_" + i).innerHTML = document.getElementById("contributors_" + i).innerHTML + output+", ";
                    }
                      if (data["journal-title"] != null) {
                        var output = data["journal-title"].value;
                        document.getElementById("publication_" + i).innerHTML = document.getElementById("publication_" + i).innerHTML + ", "+ output;
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });      

 }    
 
function getbib(orcidID, putcode, i, withlink) {
    var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/work/" + putcode;
    fetch(ORCIDLink,
        {
            headers: {
                "Accept": "application/orcid+json"
            }
        })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                    if (data["citation"] != null) {
                     if (withlink) {
                        var output = data["citation"]["citation-value"];
                        output=output.replace(/\\/g,'\\\\').replace(/'/g,'\\\&\#39\;').replace(/"/g,'\\\&quot\;').replace(/\`/g,'\\\&\#96\;'); 

                        document.getElementById("bibtex_" + i).innerHTML = document.getElementById("bibtex_" + i).innerHTML + '\['+fancylink('BibTeX','javascript\:var myWindow = window.open\(\'\',\'\_blank\'\)\;myWindow\.document\.write\(\''+output+'\'\);','',linkcolour,bibcolour)+'\] ';
                     } else {
                        document.getElementById("bibtex_" + i).innerHTML = document.getElementById("bibtex_" + i).innerHTML + '\[BibTeX\] ';
                      }
                    }
                     //if (data["contributors"] != null) {
                        for (var cont in data["contributors"].contributor) {
                          var output = data["contributors"]["contributor"][cont]["credit-name"].value;

                          document.getElementById("contributors_" + i).innerHTML = document.getElementById("contributors_" + i).innerHTML + output+", ";
                      //  }
                    }
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });      

 }       


        
function openwindow(str){
var myWindow = window.open("", "window", "width=200, height=100");
myWindow.document.write(str);
}
      
        
function fancylink(text, link, extra, colour, bgcolour) {
  var machin='\<a ';
  machin +='onmouseover=\"this.style.color=\''+colour+'\'\;\" ';
  machin +='onmouseout=\"this.style.color=\''+bgcolour+'\'\;\" ';
  machin +=extra;
  machin +='href=\"'+link+'\"\>'+text+'\<\/a\>';      
return machin;
}
