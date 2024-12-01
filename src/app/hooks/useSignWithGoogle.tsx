import useGlobalStorage from "@/store"
import { CLIENT_ID, FULLNODE_URL, KEY_PAIR_SESSION_STORAGE_KEY, MAX_EPOCH_LOCAL_STORAGE_KEY, RANDOMNESS_SESSION_STORAGE_KEY, REDIRECT_URI, USER_SALT_LOCAL_STORAGE_KEY } from "@/utils/constants"
import { SuiClient } from "@mysten/sui.js/client"
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519"
import { generateNonce, generateRandomness, jwtToAddress } from "@mysten/zklogin"
import { useRouter } from "next/navigation"
import queryString from "query-string"
import { useEffect } from "react"

const suiClient = new SuiClient({ url: FULLNODE_URL })

function useSignWithGoogle() {
    const { address, setAddress } = useGlobalStorage()
    const router = useRouter()

    useEffect(() => {
        const res = queryString.parse(window.location.hash)
        if (res.id_token) {
            const salt = generateRandomness()
            window.localStorage.setItem(USER_SALT_LOCAL_STORAGE_KEY, salt)
            const zkLoginUserAddress = jwtToAddress(res.id_token as string, salt)
            setAddress(zkLoginUserAddress)
            router.push("/main")
        }
    }, [])

    // useEffect(() => {
    //     if (!address) router.push("/")
    // }, [address])

    async function signInWithGoogle() {
        const ephemeralKeyPair = Ed25519Keypair.generate()
        window.sessionStorage.setItem(
            KEY_PAIR_SESSION_STORAGE_KEY,
            ephemeralKeyPair.export().privateKey
        )

        const { epoch } = await suiClient.getLatestSuiSystemState()
        const maxEpoch = Number(epoch) + 10
        window.localStorage.setItem(MAX_EPOCH_LOCAL_STORAGE_KEY, String(maxEpoch))

        const randomness = generateRandomness()
        window.sessionStorage.setItem(RANDOMNESS_SESSION_STORAGE_KEY, randomness)

        const nonce = generateNonce(
            ephemeralKeyPair.getPublicKey(),
            maxEpoch,
            randomness
        )

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: "id_token",
            scope: "openid",
            nonce,
        })

        window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    }

    return { signInWithGoogle }
}

export default useSignWithGoogle