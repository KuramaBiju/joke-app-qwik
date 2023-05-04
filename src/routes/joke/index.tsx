import { component$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { routeLoader$,routeAction$, Form, server$ } from '@builder.io/qwik-city';
import STYLES from "./index.css?inline";

// Use routeLoader$ to load data from the server.
export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});
// Use routeAction$ to handle actions from the client to the server.
export const useJokeVoteAction = routeAction$((props) => {
    console.log('VOTE', props);
  });
 
export default component$(() => {
    useStylesScoped$(STYLES);

  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  //For Update The State useSignals
  const isFavoriteSignal = useSignal(false);
  //UseTask is like UseEffects. Execute in server and client
  useTask$(({ track }) => {
    //Track is for track the changes in the signal
    track(()=> isFavoriteSignal.value);
    console.log('FAVORITE (isomorphic)', isFavoriteSignal.value);
    //Server$ is for execute something in server
    server$(() => {
      console.log('FAVORITE (server)', isFavoriteSignal.value);
    })();
  });
  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">👍</button>
        <button name="vote" value="down">👎</button>
      </Form>
      <button
 onClick$={() => {
   isFavoriteSignal.value = !isFavoriteSignal.value;
 }}>
  {isFavoriteSignal.value ? '❤️' : '🤍'}
</button>

    </section>
  );
});