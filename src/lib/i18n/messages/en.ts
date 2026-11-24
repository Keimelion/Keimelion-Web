import auth from './en/auth.json'
import common from './en/common.json'
import dev from './en/dev.json'
import errorMessages from './en/error.json'
import home from './en/home.json'
import invites from './en/invites.json'
import lists from './en/lists.json'
import query from './en/query.json'

export const enMessages = {
  ...common,
  ...home,
  ...auth,
  ...lists,
  ...invites,
  ...errorMessages,
  ...query,
  ...dev,
} satisfies Record<string, string>

export type MessageId = keyof typeof enMessages
