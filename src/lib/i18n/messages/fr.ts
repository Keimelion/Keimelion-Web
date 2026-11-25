import type { MessageId } from './en'
import auth from './fr/auth.json'
import common from './fr/common.json'
import dev from './fr/dev.json'
import errorMessages from './fr/error.json'
import home from './fr/home.json'
import invites from './fr/invites.json'
import lists from './fr/lists.json'
import query from './fr/query.json'

export const frMessages = {
  ...common,
  ...home,
  ...auth,
  ...lists,
  ...invites,
  ...errorMessages,
  ...query,
  ...dev,
} satisfies Record<MessageId, string>
