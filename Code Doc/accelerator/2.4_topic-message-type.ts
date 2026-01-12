// @ts-nocheck
export const enum TopicMessageType {
  TopicNext = 'TopicNext',
  TopicGet = 'TopicGet',
  TopicResolve = 'TopicResolve',
}

/*


* TopicNext = 'TopicNext'  = >  Here is a new value for this Topic.
currentWorkspace$.publish(workspace)
      {
        type: TopicNext,
        name: 'current-workspace',
        version: 1,
        data: workspace
      }
Who receives it?
Every app that has:
new Topic('current-workspace', 1)
What each Topic does
      this.isInit = true
      this.data.next(workspace)
      this.resolveInitPromise()







* TopicGet = 'TopicGet'  = > Your publish is finished
MFE A code (automatic)
      const t = new Topic('current-workspace', 1)
Inside the constructor, Topic does:
      const message = {
        type: 'TopicGet',
        name: 'current-workspace',
        version: 1
      }
      this.sendMessage(message)
So MFE A sends:
      {
        type: 'TopicGet',
        name: 'current-workspace',
        version: 1
      }
Who receives TopicGet? Eg : Shell Topic 
Any other Topic with same name/version
Shell’s Topic reaction
Shell already has data, so it responds with TopicNext again:
      {
        type: 'TopicNext',
        name: 'current-workspace',
        version: 1,
        data: {
          name: 'Finance',
          homePage: '/dashboard'
        }
      }





      

* TopicResolve = 'TopicResolve'  = > Your publish is finished
    await currentWorkspace$.publish(workspace)
    console.log('Publish completed')
Publishing actually sends two messages.
Step 1 — Send TopicNext
    {
      type: 'TopicNext',
      name: 'current-workspace',
      version: 1,
      data: workspace,
      id: 42
    }
Step 2 — Send TopicResolve
    {
      type: 'TopicResolve',
      name: 'current-workspace',
      version: 1,
      resolveId: 42
    }
What listeners do
When Topics finish processing TopicNext, they allow TopicResolve to pass back.
The publishing Topic sees:
    resolvePromiseResolver[42]()
This completes the Promise returned by publish().
Result Only now does this line continue:
      await currentWorkspace$.publish(workspace)


*/