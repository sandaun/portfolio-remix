// app/routes/index.jsx
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { Github, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { obtenirUbicacio, trobarMunicipiMesProper } from '~/utils/location';

// Weather icons from Meteocons
const WeatherIcon = ({ iconName }) => (
  <img
    src={`https://bas.dev/meteocons/${iconName}.svg`}
    alt={iconName}
    className="w-8 h-8"
  />
);

// Loader per obtenir les dades de la API de Meteocat o OpenWeather
export async function loader({ request }) {
  // Coordenades estàtiques per a Barcelona (pots adaptar-ho segons les teves necessitats)
  const latitude = 41.3851;
  const longitude = 2.1734;

  // Aproximació simple per saber si la localització és a Catalunya
  const isInCatalonia =
    latitude > 40.5 && latitude < 42.9 && longitude > 0.15 && longitude < 3.33;

  console.log(3, isInCatalonia);

  let weatherData;

  if (isInCatalonia) {
    // Usar la API de Meteocat per obtenir dades de temps a Catalunya
    const response = await fetch(
      // `https://api.meteo.cat/xema/v1/estacions/mesurades?latitud=${latitude}&longitud=${longitude}`,
      `https://api.meteo.cat/xema/v1/estacions/metadades?estat=ope&data=2017-03-27Z`,
      {
        headers: {
          // 'x-api-key': '357UcgVLWn2n2atoRWzGU2hojW9Lua8Z8RoT3RCy', // Recorda utilitzar la teva API key
        },
      }
    );

    // console.log('@@@@@@METEOCAT', response);

    const data = await response.json();
    // Processar dades de la API (adaptar segons la resposta real)
    weatherData = {
      temperature: data.temperatura || 20, // Valors de placeholder
      condition: data.estatCel || 'sol', // Ajusta segons les dades reals
      test: data,
    };
  } else {
    // Usar una API alternativa com OpenWeather per ubicacions fora de Catalunya
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_OPENWEATHER_API_KEY`
    );

    console.log(4, response);

    const data = await response.json();
    weatherData = {
      temperature: data.main.temp,
      condition: data.weather[0].main.toLowerCase(),
    };
  }

  // Retornar dades per utilitzar en el component
  return json({ weather: weatherData });
}

export default function Index() {
  const [municipi, setMunicipi] = useState(null);
  const [error, setError] = useState(null);

  const { weather } = useLoaderData();

  console.log(1, weather);
  console.log(22, municipi);
  // console.log(33, error);

  useEffect(() => {
    // Carregar el JSON de municipis
    const obtenirMunicipis = async () => {
      try {
        const response = await fetch('/data/municipis.json');
        const municipis = await response.json();

        // Obtenir la ubicació de l'usuari
        const ubicacio = await obtenirUbicacio();

        // Trobar el municipi més proper
        const municipiMesProper = await trobarMunicipiMesProper(
          ubicacio,
          municipis
        );

        setMunicipi(municipiMesProper);
      } catch (err) {
        setError(
          "No s'ha pogut obtenir la ubicació o les dades dels municipis."
        );
        console.error(err);
      }
    };

    obtenirMunicipis();
  }, []);

  return (
    <div className="mx-auto min-h-screen px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0 bg-[rgb(15,23,42)] text-gray-300 ">
      <WeatherWidget weather={weather} />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">
        <LeftColumn />
        <RightColumn />
      </div>
    </div>
  );
}

function WeatherWidget({ weather }) {
  if (!weather) return null;

  return (
    <div className="absolute top-4 right-4 bg-[#112240] p-2 rounded-lg flex items-center space-x-2">
      <WeatherIcon iconName={weather.condition.toLowerCase()} />
      <span className="text-white text-sm">
        {Math.round(weather.temperature)}°C
      </span>
    </div>
  );
}

function LeftColumn() {
  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-slate-200 mb-4">Oriol Carbó</h1>
        <h2 className="text-xl text-slate-200 mb-4">Frontend Engineer</h2>
        <p className="text-sm">
          I build pixel-perfect, engaging, and accessible digital experiences.
        </p>
      </header>

      <nav className="mb-12">
        <ul className="space-y-5">
          <li className="flex items-center">
            <div className="h-px bg-gray-600 w-12 mr-4"></div>
            <span className="text-sm uppercase tracking-widest font-semibold">
              About
            </span>
          </li>
          <li className="flex items-center">
            <div className="h-px bg-gray-600 w-12 mr-4"></div>
            <span className="text-sm uppercase tracking-widest">
              Experience
            </span>
          </li>
          <li className="flex items-center">
            <div className="h-px bg-gray-600 w-12 mr-4"></div>
            <span className="text-sm uppercase tracking-widest">Projects</span>
          </li>
        </ul>
      </nav>

      <footer className="mt-auto">
        <div className="flex space-x-4">
          <Link to="#" className="text-gray-400 hover:text-[#64ffda]">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>

          <Link to="#" className="text-gray-400 hover:text-[#64ffda]">
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          {/* <Link href="#" className="text-gray-400 hover:text-[#64ffda]">
            <Codepen className="w-5 h-5" />
            <span className="sr-only">CodePen</span>
          </Link>
          <Link href="#" className="text-gray-400 hover:text-[#64ffda]">
            <Instagram className="w-5 h-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="#" className="text-gray-400 hover:text-[#64ffda]">
            <Twitter className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-gray-400 hover:text-[#64ffda]">
            <Codesandbox className="w-5 h-5" />
            <span className="sr-only">CodeSandbox</span>
          </Link> */}
        </div>
      </footer>
    </div>
  );
}

function RightColumn() {
  return (
    <div id="content" className="pt-24 lg:w-1/2 lg:py-24">
      <main className="space-y-16">
        <section>
          <p className="mb-4">
            Back in 2012, I decided to try my hand at creating custom Tumblr
            themes and tumbled head first into the rabbit hole of coding and web
            development. Fast-forward to today, and I've had the privilege of
            building software for an{' '}
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
            >
              advertising agency
            </a>
            ,{' '}
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
            >
              start-up
            </a>
            ,{' '}
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
            >
              huge corporation
            </a>
            , and a{' '}
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
            >
              digital product studio
            </a>
            .
          </p>

          <p className="mb-4">
            My main focus these days is building accessible user interfaces for
            our customers at <span className="text-[#64ffda]">Klaviyo</span>. I
            most enjoy building software in the sweet spot where design and
            engineering meet — things that look good but are also built well
            under the hood. In my free time, I've also released an{' '}
            <span className="text-[#64ffda]">online video course</span> that
            covers everything you need to know to build a web app with the
            Spotify API.
          </p>
          <p>
            When I'm not at the computer, I'm usually rock climbing, reading,
            hanging out with my wife and two cats, or running around Hyrule
            searching for <span className="text-[#64ffda]">Korok seeds</span>.
          </p>
        </section>

        <Experience
          dateRange="01/2024 — PRESENT"
          title="Frontend Software Engineer · Aily Labs →"
          description="Development of the Aily Labs App, using React Native for iOS and Android Platforms, specifically for the M&S Vertical. Contributing to the design system team by adding and updating new components in React, to be used in both mobile and web. Unit testing with Jest."
          tags={['React Native', 'React', 'Jest']}
        />

        <Experience
          dateRange="09/2021 — 12/2023"
          title="Mobile React Native Engineer · Yego →"
          description="Development and deployment of the Yego App and internal Ranger App with React Native for both iOS and Android platforms. Migrating components from JS to TypeScript. Development of the back office tool to manage vehicles from web with React and React Hooks. State management with Redux and React Context."
          tags={['React Native', 'TypeScript', 'React', 'Redux']}
        />

        <Experience
          dateRange="2019 — 08/2021"
          title="Fullstack Developer · Emjoy →"
          description="Development and deployment of the Emjoy App with React Native for both iOS and Android platforms. State management with MobX. Development of the back office tool to provide content to the app, using React, React Hooks, Firebase Real Time Database and Firebase Cloud Functions (NodeJS). Implementation of Detox end-to-end testing for React Native."
          tags={['React Native', 'React', 'MobX', 'Firebase', 'NodeJS']}
        />
      </main>
    </div>
  );
}

function Experience({ dateRange, title, description, tags }) {
  return (
    <section>
      <div className="flex mb-2">
        <div className="w-1/4 text-xs text-gray-500">{dateRange}</div>
        <div className="w-3/4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/4"></div>
        <div className="w-3/4">
          <p className="text-sm mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#112240] text-[#64ffda] text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
