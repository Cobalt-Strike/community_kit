# How to properly report Defects/Bugs

## Describe the problem with as much context as possible

When you report a bug [or request support], try to answer these questions:

1. What are you trying to do?
2. Which steps did you take to accomplish this?
3. What happened?
4. What did you expect?
5. Which steps did you take to troubleshoot it?

Example:

>_“I’m trying to use the DNS Beacon (windows/beacon_dns/reverse_http). I setup an A record for malwarec2.losenolove.com on my team server. I pointed NS records for profiles.losenolove.com and game.losenolove.com to malwarec2.losenolove.com. I’m not able to get a system in my customer’s environment to call back. I don’t know how to troubleshoot further.”_

## Describe the Environment

It’s important to know which version of Cobalt Strike you’re using and which version of Java. Cobalt Strike makes this very easy. Go to ```Help > System Information```. 

This will generate a system information summary for your Cobalt Strike client AND team server.

## Provide the Team Server Console Messages

When you file a report or ask a question, it’s very helpful to provide all of the output of the Cobalt Strike client and team server in your initial query. Please don’t paraphrase this information. Screenshots, cellphone photos of your screen, and copy/paste are all equally fine.

## Provide a List of Threads and Stack Traces

If Cobalt Strike deadlocks [freezes, either the server or the client] OR if you notice Cobalt Strike is eating your CPU, it will help if you dump a list of all threads currently running in Cobalt Strike. 

This is easy to do on Linux with the ```kill``` command. Use ```ps waux | grep java``` to find the Java processes that are running. Use ```kill -3 <PID>``` to request the Java process dump a list of all threads with a detailed stacktrace for each. 

As a bonus, if this feature detects a deadlock, it will say so. If a deadlock occurs AND the team has this information from both the team server and the client, we have a really good chance of fixing it.

## Provide Memory Use

If your Cobalt Strike team server or client seems like it’s hogging memory, consider dumping a summary of your Java heap. 

The ```jmap``` tool that ships with Java makes this easy. The preferred output comes from ```jmap –histo:live <PID>```. 

If this returns an error, try: ```jmap –F –histo <PID>```. These commands will dump a full summary of Java objects in memory. If you provide the team with this information for both your team server and Cobalt Strike client—it will help us to track down memory leaks or memory-related performance issues.

[Read More...](https://www.cobaltstrike.com/blog/a-quick-guide-to-bug-reports)