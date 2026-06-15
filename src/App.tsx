import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import BrandPage from './pages/BrandPage'
import HeroEditPage from './pages/HeroEditPage'
import HeroDemoPage from './pages/HeroDemoPage'
import HomeMovPage from './pages/HomeMovPage'
import WhiteBasePage from './pages/WhiteBasePage'
import WhitePage from './pages/WhitePage'
import SurveyPage from './pages/SurveyPage'
import NotFoundPage from './pages/NotFoundPage'
import QuestionCsatDemoPage from './pages/QuestionCsatDemoPage'
import QuestionDateDemoPage from './pages/QuestionDateDemoPage'
import QuestionEmailDemoPage from './pages/QuestionEmailDemoPage'
import QuestionTextDemoPage from './pages/QuestionTextDemoPage'
import QuestionMultiSelectDemoPage from './pages/QuestionMultiSelectDemoPage'
import QuestionNpsScoreDemoPage from './pages/QuestionNpsScoreDemoPage'
import QuestionNumberDemoPage from './pages/QuestionNumberDemoPage'
import QuestionPhoneDemoPage from './pages/QuestionPhoneDemoPage'
import QuestionRadioDemoPage from './pages/QuestionRadioDemoPage'
import QuestionRatingDemoPage from './pages/QuestionRatingDemoPage'
import QuestionSelectDemoPage from './pages/QuestionSelectDemoPage'
import QuestionTextareaDemoPage from './pages/QuestionTextareaDemoPage'
import QuestionTimeDemoPage from './pages/QuestionTimeDemoPage'
import QuestionYesOrNoDemoPage from './pages/QuestionYesOrNoDemoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ErrorPage variant="invalid-link" />} />
        <Route path="/hero-demo" element={<HeroDemoPage />} />
        <Route path="/hero-edit" element={<HeroEditPage />} />
        <Route path="/home-mov" element={<HomeMovPage />} />
        <Route path="/white" element={<WhitePage />} />
        <Route path="/white-base" element={<WhiteBasePage />} />
        <Route path="/question-base/text" element={<QuestionTextDemoPage />} />
        <Route path="/question-base/mult-question" element={<QuestionMultiSelectDemoPage />} />
        <Route path="/question-base/radio" element={<QuestionRadioDemoPage />} />
        <Route path="/question-base/rating" element={<QuestionRatingDemoPage />} />
        <Route path="/question-base/csat" element={<QuestionCsatDemoPage />} />
        <Route path="/question-base/nps-score" element={<QuestionNpsScoreDemoPage />} />
        <Route path="/question-base/textarea" element={<QuestionTextareaDemoPage />} />
        <Route path="/question-base/email" element={<QuestionEmailDemoPage />} />
        <Route path="/question-base/phone" element={<QuestionPhoneDemoPage />} />
        <Route path="/question-base/number" element={<QuestionNumberDemoPage />} />
        <Route path="/question-base/date" element={<QuestionDateDemoPage />} />
        <Route path="/question-base/time" element={<QuestionTimeDemoPage />} />
        <Route path="/question-base/select" element={<QuestionSelectDemoPage />} />
        <Route path="/question-base/yes-or-not" element={<QuestionYesOrNoDemoPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
