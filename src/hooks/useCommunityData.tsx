import { authModalState } from '../atoms/authModalAtom';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';
import { useRouter } from 'next/router';

const useCommunityData = () => {
    // ↓ Recoil [Global State]
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //                                ↓ Grabs data from Header.tsx onCLick ↓
    const onJoinLeaveCommunity = (communityData: Community, isJoined?: boolean) => {
        
        if(!user) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }
        setLoading(true);
        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    }

    const getMySnippets = async () => {
        setLoading(true);
        try {
        // ↓ get users communitySnippets
        const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`));
        // ↓ extract all the data and convert them into Objects ({ ...doc.data() })
        const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }));
        // console.log("here are the snippets of the current user: ", snippets);

        // ↓ set the current user snippets to RECOIL [Global State] '../atoms/communitiesAtom';
        setCommunityStateValue(prev => ({
            ...prev, //Current Value
            mySnippets: snippets as CommunitySnippet[], // Set current snippet
            snippetsFetched: true
        }))
        // ↑ now isJoined from Header.tsx can find if current user isJoined to the current community

        setLoading(false);
        } catch (error: any) {
            console.log("Error getting user snippets", error);
            setError(error.message);
        }
        setLoading(false);
    };
    //                              ↓ const onJoinLeaveCommunity =>  joinCommunity(communityData); 
    const joinCommunity = async (communityData: Community) => {
    //Batch write = Only WIRTES data to db
        //Creating a new community snippet from user
        try{
            // ↓ DECLARE batch
            const batch = writeBatch(firestore);

            // ↓ Grabs the current community data
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId
            }

            // ↓ UPDATES the current user's communitySnippets
            batch.set(
                doc(
                firestore,
                `users/${user?.uid}/communitySnippets`,
                communityData.id 
                ),
                newSnippet // → Adds the current community to user's communitySnippets
            );

            // ↓ UPDATES the numbersOfMembers(+1)
            batch.update(doc(firestore, "communities", communityData.id), {
                numberOfMembers: increment(1),
            });

            // ↓ EXECUTES the batch
            await batch.commit();

            // ↓ UPDATES recoil state - communityState.mySnippets
            setCommunityStateValue((prev) => ({
            ...prev, // ← Current value
            mySnippets: [...prev.mySnippets, newSnippet], // ← Appends Current Snippets and the New Snippet
            }));
        } catch (error) {
            console.log('joinCommunity Error: ', error);
        }
        setLoading(false);
    };
    //                              ↓ const onJoinLeaveCommunity =>  leaveCommunity(communityData.id); 
    const leaveCommunity = async (communityId: string) => {
        //Batch write
            //Deleting a new community snippet from user
            try {
                // ↓ DECLARE batch
                const batch = writeBatch(firestore);

                // ↓ DELETES the current user's communitySnippets
                batch.delete(
                  doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
                );

                // ↓ UPDATES the numbersOfMembers(-1)
                batch.update(doc(firestore, "communities", communityId), {
                  numberOfMembers: increment(-1),
                });

                // ↓ EXECUTES the batch
                await batch.commit();

                // ↓ UPDATES recoil state - communityState.mySnippets
                // ↓ filter() => Loops through my community snippets and only shows/returns snippets that's NOT EQUAL to current community page
                setCommunityStateValue((prev) => ({
                  ...prev, // ← Current value
                  mySnippets: prev.mySnippets.filter( 
                    (item) => item.communityId !== communityId
                  ),
                }));
                
            } catch (error) {
                console.log("leaveCommunity error", error);
            }
            setLoading(false);
        //update recoil state - communityState.mySnippets
    };
    // Data for [pid] page will be erased when page rehreshes

    // GRABS data directly from database if page is refreshed and;
    //STORES data to Recoil
    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(
              firestore,
              "communities",
              communityId
            );
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue((prev) => ({
              ...prev,
              currentCommunity: {
                id: communityDoc.id,
                ...communityDoc.data(),
              } as Community,
            }));
          } catch (error: any) {
            console.log("getCommunityData error: ", error.message);
          }
    }

    const userLoggedoutClearRecoil = () => {
        setCommunityStateValue((prev) => ({
            ...prev, // ← Current value
            mySnippets: [],
            snippetsFetched: false
        }));
    }

    // ↓ This will automatically trigger when the page loads
    useEffect(() => {
        if(!user) {
            userLoggedoutClearRecoil();
            return;
        } 
        getMySnippets(); // Should only trigger when user is available
    }, [user])
    //   ↑ user will prevent this function to trigger uneccessarily. Hence, it will only trigger when there's changes. Example logged out or logged in as a new user 
    
    // ↓ Data for [pid] page will be erased when page rehreshes
    // ↓ GRABS data directly from database if page is refreshed
    useEffect(() => {
        const { communityId } = router.query;

        if (communityId && !communityStateValue.currentCommunity){
            getCommunityData(communityId as string);
        }
    }, [router.query,communityStateValue.currentCommunity])
    return {
        //data
        communityStateValue,
        onJoinLeaveCommunity,
        loading
    };
};
export default useCommunityData;
