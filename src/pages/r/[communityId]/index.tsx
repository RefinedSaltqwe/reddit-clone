import { firestore } from '../../../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { Community, communityState } from '../../../atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import CommunityNotFound from '../../../components/Community/CommunityNotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Posts from '../../../components/Posts/Posts';
import { useSetRecoilState } from 'recoil';
import About from '../../../components/Community/About';

// *************** READ IMPORTANT BELOW *********************
type CommunityPageProps = {
    communityData: Community; // ← THIS is the Start...This is how to access the atom data that's SET Below *IMPORTANT*. 
};

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {
    // console.log("[communityId] - index Data",communityData );
    const setCommunityStateValue = useSetRecoilState(communityState);
    
    //THIS IS WHERE WE SET THE DATA to RECOIL[Global State] WHENEVER we load a community group
    //Set the value to --- import { currentCommunity } from '../../../atoms/communitiesAtom';
    useEffect(() => {
        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: communityData,
        }));
     
      }, [communityData]);
      //      ↑ This will trigger whenever this data changes. Example when user goes to another community

        // Community was not found in the database
        if (!communityData) {
            return <CommunityNotFound />;
        }
    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                {/* Left Content */}
                <>
                    <CreatePostLink/>
                    <Posts communityData={communityData} />
                </>
                {/* Right Content */}
                <>
                    <About communityData={communityData}/>
                </>
            </PageContent>
        </>
    )
    
}
//*************IMPORTANT ***************/ ↓↑←→

//GetServerSidePropsContext - access the page router to grab the URL and;

export async function getServerSideProps(context: GetServerSidePropsContext){

    //  ↓  GET community data and pass it to client
    try {
        const communityDocRef = doc(
          firestore,
          "communities", 
          context.query.communityId as string // ← Grabs the pageId/communityId (localhost:3000/r/[communityId]) thats coming from the url/router
            //              ↑ communityId comes from 3000/r/[communityId] folder 
        );
        // ↓ GRAB the data from firebase
        const communityDoc = await getDoc(communityDocRef);
        // THIS IS THE CURRENT COMMUNITY PAGE
        // ↓ SET the data to communityData 
        return {
            props: {
              communityData: communityDoc.exists()
                ? JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
                  )//  ↑ installed 
                : "",
            },
        };
      } catch (error) {
        // Could create error page here
        console.log("getServerSideProps error - [community]", error);

        return { 
            props: {
                ok: false, 
                reason: "some error description for your own consumption, not for client side"
            },
            // redirect: {
            //     destination: '/',
            //     statusCode: 307
            // }
        }
        
    }
}

export default CommunityPage;


