import app from './app';
import { PORT } from './services/utils/constants';

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
