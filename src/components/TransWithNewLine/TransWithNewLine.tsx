import { Trans } from "react-i18next"

type TransWithNewLineProps = {
  i18nkey: string
}

const TransWithNewLine = ({ i18nkey }: TransWithNewLineProps) => {
  return (
    <Trans
      i18nKey={i18nkey}
      components={{
        strong: <strong />,
        br: <br />,
        span: <span />,
        u: <u />,
        ul: <ul />,
        li: <li />,
      }}
    />
  )
}

export default TransWithNewLine
