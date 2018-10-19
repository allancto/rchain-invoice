# Rchain Invoice Agreement application management.


## Starting the agreeement collection process:

To start the application, we need to create the file that agreements are stored to. You'll need to provide the hashed invoice data from google sheets in csv format, and pass it when calling the script. 

``node initiate_agreements_file.js <csv file containing the exported purple rows>``


## Pulling agreements off server:

To pull the agreements off the server, run the save_agreements_csv script. This will create a csv file. Download the csv file to your local machine, and import it into the google sheet.

``node save_agreements_csv.js``



## Pausing e-signing:

To pause the system, remove the agreementLog.json file in the data directory.  

While in the scripts directory:
``$ rm ../data/agreementLog.json``


## Admin notes:

Running this app requires rw access to the server invoice.rhobot.net. Currently admins on this server are @whereyouatwimm and @dckc. 

Login to the server via SSH from Linux or from Windows using PuTTy invoice.rhobot.net, port 22. Once on the server navigate to /home/invoice/rchain-invoice/scripts. 

To begin collecting signatures, copy "purple.csv" into the scripts folder and run node initiate_agreements* > purple.csv as above. To retrieve signatures run node saveagreements* as above. The input and output are in the same format, basically a csv file with "input" columns for eth hashes and other data, and "output" columns for signature and timestamps. With PuTTy the csv data may be copied-pasted using right click (google for details). Running node save_agreements* also returns a status summary report of the number of agree, disagree and not responded. 



