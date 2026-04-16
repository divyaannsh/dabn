import mammoth from "mammoth";
import fs from "fs";

const filePath = "/Users/divyanshsrivastava/prerna/Compressor_Cross_Reference_Guide.docx";

mammoth.extractRawText({path: filePath})
    .then(function(result){
        const text = result.value;
        console.log(text.substring(0, 5000));
    })
    .catch(function(err){
        console.log(err);
    });
