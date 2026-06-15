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
        <Route path="/brand/hero-demo" element={<HeroDemoPage />} />
        <Route path="/brand/hero-edit" element={<HeroEditPage />} />
        <Route path="/brand/home-mov" element={<HomeMovPage />} />
        <Route path="/brand/white" element={<WhitePage />} />
        <Route path="/brand/white-base" element={<WhiteBasePage />} />
        <Route path="/brand/question-base/text" element={<QuestionTextDemoPage />} />
        <Route path="/brand/question-base/mult-question" element={<QuestionMultiSelectDemoPage />} />
        <Route path="/brand/question-base/radio" element={<QuestionRadioDemoPage />} />
        <Route path="/brand/question-base/rating" element={<QuestionRatingDemoPage />} />
        <Route path="/brand/question-base/csat" element={<QuestionCsatDemoPage />} />
        <Route path="/brand/question-base/nps-score" element={<QuestionNpsScoreDemoPage />} />
        <Route path="/brand/question-base/textarea" element={<QuestionTextareaDemoPage />} />
        <Route path="/brand/question-base/email" element={<QuestionEmailDemoPage />} />
        <Route path="/brand/question-base/phone" element={<QuestionPhoneDemoPage />} />
        <Route path="/brand/question-base/number" element={<QuestionNumberDemoPage />} />
        <Route path="/brand/question-base/date" element={<QuestionDateDemoPage />} />
        <Route path="/brand/question-base/time" element={<QuestionTimeDemoPage />} />
        <Route path="/brand/question-base/select" element={<QuestionSelectDemoPage />} />
        <Route path="/brand/question-base/yes-or-not" element={<QuestionYesOrNoDemoPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
