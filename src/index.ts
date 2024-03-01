import { Context, Plugin, PluginInitParams, PublicAPI, Query, Result } from "@wox-launcher/wox-plugin"
import emoji from "emojilib"
import clipboard from "clipboardy"

let api: PublicAPI

export const plugin: Plugin = {
  init: async (ctx: Context, initParams: PluginInitParams) => {
    api = initParams.API
    await api.Log(ctx, "Debug", `init, directory:${initParams.PluginDirectory}`)
  },

  query: async (ctx: Context, query: Query): Promise<Result[]> => {
    let search = query.Search
    if (query.Search === "") {
      await api.Log(ctx, "Debug", "empty search, use default search")
      search = "smile"
    }

    return Object.keys(emoji)
      .filter(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const emojiData = emoji[key] as string[]
        return emojiData.some((keyword: string) => {
          return keyword.includes(search)
        })
      })
      .map(key => {
        return {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
