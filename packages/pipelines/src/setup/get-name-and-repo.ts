import cli from 'cli-ux'

import {pipelineName, repoName} from './validate'

function filter(obj: any) {
  const ret: any = {}
  Object.keys(obj)
    .filter((key: any) => obj[key] !== undefined)
    .forEach((key: string) => { ret[key] = obj[key] })
  return ret
}

interface GetNameAndRepoAnswer {
  name: string | boolean
  repo: string | boolean
}

export default async function getNameAndRepo(args: any) {
  let answer: GetNameAndRepoAnswer = {
    name: '',
    repo: ''
  }

  if (!args.name) {
    let name = await cli.prompt('Pipeline name', {
      required: true
    })

    const [valid, msg] = pipelineName(name)

    if (valid) {
      answer.name = name
    } else {
      cli.error(msg as string)
    }
  }

  if (!args.repo) {
    let repo = await cli.prompt('GitHub repository to connect to (e.g. rails/rails)', {
      required: true
    })

    const [valid, msg] = repoName(repo)
    if (valid) {
      answer.repo = repo
    } else {
      cli.error(msg as string)
    }
  }

  const reply: any = Object.assign(filter(answer), filter(args))
  reply.name = reply.name.toLowerCase().replace(/\s/g, '-')

  return reply
}
