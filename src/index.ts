import type { Plugin, PluginInitContext, Query, Result } from "@wox-launcher/wox-plugin"
import emoji from "emojilib"
import clipboard from "clipboardy"

export const plugin: Plugin = {
  init: async (context: PluginInitContext) => {},

  query: async (query: Query): Promise<Result[]> => {
    let search = query.Search
    if (query.Search === "") {
      search = "smile"
    }

    return Object.keys(emoji)
      .filter(key => {
        // @ts-ignore
        const emojiData = emoji[key] as string[]
        return emojiData.some((keyword: string) => {
          return keyword.includes(search)
        })
      })
      .map(key => {
        return {
          // @ts-ignore
          Title: (emoji[key][0] as string).replace(/_/g, " "),
          Icon: {
            ImageType: "emoji",
            ImageData: key
          },
          Actions: [
            {
              Name: "Copy",
              Action: async () => {
                await clipboard.write(key)
              }
            }
          ]
        } as Result
      })
  }
}
