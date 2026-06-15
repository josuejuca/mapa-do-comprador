import SkylineBrasilia from '../SkylineBrasilia'

type QuestionBaseSkylineProps = {
  mainColor?: string
  softColor?: string
  thinColor?: string
  hatchColor?: string
}

export function QuestionBaseSkyline({
  mainColor = '#0013351f',
  softColor = '#0013351f',
  thinColor = '#0013351f',
  hatchColor = '#0013351f',
}: QuestionBaseSkylineProps) {
  return (
    <SkylineBrasilia
      className="white-skyline"
      mainColor={mainColor}
      softColor={softColor}
      thinColor={thinColor}
      hatchColor={hatchColor}
    />
  )
}
