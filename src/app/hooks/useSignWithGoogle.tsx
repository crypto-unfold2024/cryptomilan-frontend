
import { PartialZkLoginSignature } from "@/app/zk/page"
import useGlobalStorage from "@/store"
import { CLIENT_ID, FULLNODE_URL, KEY_PAIR_SESSION_STORAGE_KEY, MAX_EPOCH_LOCAL_STORAGE_KEY, RANDOMNESS_SESSION_STORAGE_KEY, REDIRECT_URI, USER_SALT_LOCAL_STORAGE_KEY } from "@/utils/constants"
import { SuiClient } from "@mysten/sui.js/client"
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519"
import { fromB64 } from "@mysten/sui.js/utils"
import { generateNonce, generateRandomness, jwtToAddress } from "@mysten/zklogin"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { useRouter } from "next/navigation"
import queryString from "query-string"
import { useEffect, useState } from "react"

const suiClient = new SuiClient({ url: FULLNODE_URL });


const useSignWithGoogle = () => {
    const { address, setAddress } = useGlobalStorage()
    const [ephemeralKeyPair, setEphemeralKeyPair] = useState<Ed25519Keypair>();
    const [oauthParams, setOauthParams] =
        useState<queryString.ParsedQuery<string>>();
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [currentEpoch, setCurrentEpoch] = useState("");
    const [nonce, setNonce] = useState("");
    const [zkLoginUserAddress, setZkLoginUserAddress] = useState("");
    const [decodedJwt, setDecodedJwt] = useState<JwtPayload>();
    const [jwtString, setJwtString] = useState("");
    const [userSalt, setUserSalt] = useState<string>();
    const [zkProof, setZkProof] = useState<PartialZkLoginSignature>();
    const [extendedEphemeralPublicKey, setExtendedEphemeralPublicKey] =
        useState("");
    const [maxEpoch, setMaxEpoch] = useState(0);
    const [randomness, setRandomness] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const [fetchingZKProof, setFetchingZKProof] = useState(false);
    const [executingTxn, setExecutingTxn] = useState(false);
    const [executeDigest, setExecuteDigest] = useState("");

    const router = useRouter()
    useEffect(() => {
        const res = queryString.parse(window.location.hash);
        setOauthParams(res);
    }, [window.location]);

    // useEffect(() => {
    //     if (!address) {
    //         router.push("/")
    //     }
    // }, [address])

    useEffect(() => {
        if (oauthParams && oauthParams.id_token) {
            debugger
            const decodedJwt = jwtDecode(oauthParams.id_token as string);
            setJwtString(oauthParams.id_token as string);
            const salt = generateRandomness();
            window.localStorage.setItem(
                USER_SALT_LOCAL_STORAGE_KEY,
                salt
            );
            setDecodedJwt(decodedJwt);
            const zkLoginUserAddress = jwtToAddress(oauthParams.id_token, salt);
            setAddress(zkLoginUserAddress)
            router.push("/main")
            setZkLoginUserAddress(zkLoginUserAddress);
        }
    }, [oauthParams]);

    useEffect(() => {
        const privateKey = window.sessionStorage.getItem(
            KEY_PAIR_SESSION_STORAGE_KEY
        );
        if (privateKey) {
            const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
                fromB64(privateKey)
            );
            setEphemeralKeyPair(ephemeralKeyPair);
        }
        const randomness = window.sessionStorage.getItem(
            RANDOMNESS_SESSION_STORAGE_KEY
        );
        if (randomness) {
            setRandomness(randomness);
        }
        const userSalt = window.localStorage.getItem(USER_SALT_LOCAL_STORAGE_KEY);
        if (userSalt) {
            setUserSalt(userSalt);
        }

        const maxEpoch = window.localStorage.getItem(MAX_EPOCH_LOCAL_STORAGE_KEY);

        if (maxEpoch) {
            setMaxEpoch(Number(maxEpoch));
        }
    }, []);

    const signInWithGoogle = async () => {
        debugger
        const ephemeralKeyPair = Ed25519Keypair.generate();
        window.sessionStorage.setItem(
            KEY_PAIR_SESSION_STORAGE_KEY,
            ephemeralKeyPair.export().privateKey
        );
        setEphemeralKeyPair(ephemeralKeyPair);
        const { epoch } = await suiClient.getLatestSuiSystemState();
        setCurrentEpoch(epoch);
        window.localStorage.setItem(
            MAX_EPOCH_LOCAL_STORAGE_KEY,
            String(Number(epoch) + 10)
        );
        const randomness = generateRandomness();
        window.sessionStorage.setItem(
            RANDOMNESS_SESSION_STORAGE_KEY,
            randomness
        );
        setRandomness(randomness);
        if (!ephemeralKeyPair) {
            return;
        }
        const nonce = generateNonce(
            ephemeralKeyPair.getPublicKey(),
            maxEpoch,
            randomness
        );
        setNonce(nonce);
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: "id_token",
            scope: "openid",
            nonce: nonce,
        });
        const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        window.location.replace(loginURL);
        debugger
    }
    return {
        signInWithGoogle
    }
}

export default useSignWithGoogle