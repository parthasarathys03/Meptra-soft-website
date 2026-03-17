import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

const Products = lazy(() => import('./components/Products'));
const Services = lazy(() => import('./components/Services'));
const Training = lazy(() => import('./components/Training'));
const Courses = lazy(() => import('./components/Courses'));
const Internship = lazy(() => import('./components/Internship'));
const FinalYearProjects = lazy(() => import('./components/FinalYearProjects'));
const Career = lazy(() => import('./components/Career'));
const StudentSuccess = lazy(() => import('./components/StudentSuccess'));
const TechStack = lazy(() => import('./components/TechStack'));
const About = lazy(() => import('./components/About'));
const BookConsultation = lazy(() => import('./components/BookConsultation'));
const Register = lazy(() => import('./components/Register'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Suspense fallback={null}>
        <Products />
        <Services />
        <Training />
        <Courses />
        <Internship />
        <FinalYearProjects />
        <Career />
        <StudentSuccess />
        <TechStack />
        <About />
        <BookConsultation />
        <Register />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}
