import { Scheduler } from './components/Scheduler';

function App() {
  // Main app component
  console.log('App component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600">Scheduler App Loading...</h1>
        <p className="text-gray-600">If you see this, React is working!</p>
      </div>
      <Scheduler />
    </div>
  );
}

export default App;
