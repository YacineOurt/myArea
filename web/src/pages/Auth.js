'use client'
import styles from './page.module.css'
import { useEffect } from 'react';
import axios from 'axios';

 

export default function Home() {
  const userId = "dnwk2id1yn4otft";
  const urlDiscord="https://discord.com/api/oauth2/authorize?client_id=1158667304763138089&redirect_uri=http%3A%2F%2Flocalhost%3A8081&response_type=code&scope=identify"
  const urlSpotify='https://accounts.spotify.com/authorize?client_id=f827aad4fe484ecfac7134299fd2492e&response_type=code&redirect_uri=http://localhost:8081&scope=playlist-modify-public'
  const linkName = "Spotify"

  async function handleDiscord(code) {
    axios({
      method: 'post',
      url: "http://127.0.0.1:8080/discord/setCode",
      headers: {}, 
      data: {
        code: code,
        userId: userId  
      }
    });
  }
  async function handleSpotify(code) {
    axios({
      method: 'post',
      url: "http://127.0.0.1:8080/spotify/setCode",
      headers: {}, 
      data: {
        code: code,
        userId: userId  
      }
    });
  }

  useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const linkName = urlParams.get('service');
        console.log(code + linkName);
        if (code && linkName == "discord") {
            handleDiscord(code)
        } 
        else if (code && linkName == "spotify") {
            handleSpotify(code)
        }
        else {
            console.log("There is no code");
        }
    });

  return (
    <main className={styles.main}>
        <a href={urlDiscord} rel="noopener noreferrer">
            <p>Discord</p>
        </a>
        <a href={urlSpotify} rel="noopener noreferrer">
            <p>Spotify</p>
        </a>
    </main>
  )
}