type QuestionBaseLoadingProps = {
  logoSrc: string
}

export function QuestionBaseLoading({ logoSrc }: QuestionBaseLoadingProps) {
  return (
    <div className="white-loading-clip" aria-hidden="true">
      <div className="white-loading-surface" />
      <div className="white-loading-loader">
        <img className="white-loading-logo" src={logoSrc} alt="" />
      </div>
    </div>
  )
}
