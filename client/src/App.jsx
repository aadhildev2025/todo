import { Toaster } from 'sonner';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <TodoPage />
    </>
  );
}

export default App;
