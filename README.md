<h1 align="center">
  Telegram Notification GitHub Action 📬
</h1>
<h1 align="center">
  GitHub Action 的 Telegram 通知 📬
</h1>

<p align="center">
  <a href="https://github.com/dengqi/action-simple-telegram-notification-bot/actions">
    <img src="https://github.com/nerdneilsfield/action-simple-telegram-notification-bot/actions/workflows/test.yml/badge.svg" alt="Build status badge">
  </a>
</p>

<p align="center">
  Automatically send notifications to Telegram using GitHub Actions.
</p>
<p align="center">
  使用 GitHub Actions 自动向 Telegram 发送通知。
</p>

## Getting Started :airplane:

## 开始使用 :airplane:

> 你需要首先部署一个通知机器人，项目链接如下：[simple-telegram-notification-bot](https://github.com/nerdneilsfield/simple-telegram-notification-bot)。
> You need to deploy a notification bot first; the project can be found here: [simple-telegram-notification-bot](https://github.com/nerdneilsfield/simple-telegram-notification-bot).

Include this Action in your workflow to trigger on any event that GitHub Actions supports. Here’s how you can configure it:
在你的工作流程中包含此 Action，以触发 GitHub Actions 支持的任何事件。你可以在下面的例子中查看如何配置。

```yml
name: Telegram Notification
on: [push]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Send Notification
        uses: dengqi/action-simple-telegram-notification-bot@v1
        with:
          text: "Your push has been processed successfully!"
          files: "./build/output.zip"
        env:
          BOT_URL: ${{ secrets.BOT_URL }}
          BOT_TOKEN: ${{ secrets.BOT_TOKEN }}
```

## Configuration :wrench:

## 配置 :wrench:

The main configuration options for this Action are as follows:
本 Action 主要配置项如下：

| Parameter      | Description                                             | Required |
| -------------- | ------------------------------------------------------- | -------- |
| 参数           | 描述                                                    | 必需     |
| `text`         | Text message to send.                                   | No       |
| `text`         | 要发送的文本消息。                                      | 否       |
| `files`        | File path to send.                                      | No       |
| `files`        | 要发送的文件路径。                                      | 否       |
| `push_success` | Send notification when push success, default is "true". | No       |
| `push_success` | 推送成功时是否发送通知，默认为 "true"。                 | 否       |

## Environment Variables :earth_africa:

## 环境变量 :earth_africa:

- `BOT_URL`: Your Telegram bot's URL
- `BOT_URL`: 你的 Telegram bot URL
- `BOT_TOKEN`: Your Telegram bot's token
- `BOT_TOKEN`: 你的 Telegram bot token

Thanks to all [contributors](https://github.com/dengqi/action-simple-telegram-notification-bot/graphs/contributors) who have contributed to this project! 💖
感谢所有为此项目贡献的[贡献者](https://github.com/dengqi/action-simple-telegram-notification-bot/graphs/contributors)！💖

## More Information 📘

## 更多信息 📘

For more information about GitHub Actions, visit the [GitHub Actions Documentation](https://docs.github.com/en/actions).
要了解更多关于 GitHub Actions 的信息，请访问 [GitHub Actions 文档](https://docs.github.com/en/actions)。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nerdneilsfield/action-simple-telegram-notification-bot&type=Date)](https://star-history.com/#nerdneilsfield/action-simple-telegram-notification-bot&Date)

## LICENSE

这个项目依据 `A-GPLv3` 协议分发。
This project is under `A-GPLv3` protected.
