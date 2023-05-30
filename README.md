# Setup for frontend -

1. Open a new terminal in VS Code. Make sure you are in the AuthoringInterface folder.

2. Install nodejs if you do not have it by running the following commands-<br/>
      "sudo apt update"<br/>
      "sudo apt install nodejs"<br/>
      "node -v"<br/>
      "sudo apt-get install npm"<br/>
        
    \*Note - If you get the following error - <br/>
        "dpkg: error processing package mysql-server (--configure):dependency problems - leaving          unconfigured No apport report written because the error message indicates its a followup error from a previous failure.
        Errors were encountered while processing:
          mysql-server-8.0
          mysql-server
        E: Sub-process /usr/bin/dpkg returned an error code (1)"
        
      - Try the following solution -<br/>
        "sudo apt-get remove --purge nodejs"<br/>
        "sudo apt autoremove"<br/>
      Repeat the commands of step 19 from beginning to setup node properly.

3. Update the node to latest verison -<br/>
    "sudo snap install curl"<br/>
    "curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -"<br/>
    "sudo apt-get install -y nodejs"<br/>
      \*Note - If you get error in this step, run the following command -<br/>
      "sudo apt remove nodejs"<br/>
      After you have have run the above command restart from step 19.

4. Make sure you are in the AuthoringInderface directory. Now run the following command to get the frontend code.<br/>
    "git clone https://github.com/v-a-r-s-h-a/client"<br/>

5. A folder named client can be seen in the AuthoringInterface folder.

6. Move inside the client folder with the following command -<br/>
    "cd client"

7. Make sure you are in the client folder. Install all the following dependencies -<br/>
    - "npm i"

    \*Note - If you cannot install a dependecy add --legacy-peer-deps or "-force" to it as shown below - <br/>
    "npm i -force"

8. Now you are in the client folder. Start the frontend with the following command -<br/>
    "npm start"

# To start the frontend run the following commands on another terminal - <br/>
    "cd client" 
    "npm start"




