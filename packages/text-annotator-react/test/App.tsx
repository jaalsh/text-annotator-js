import React, { FC, useCallback, useState } from 'react';
import { AnnotationState, Color, useAnnotationStore, useAnnotator } from '@annotorious/react';
import { TextAnnotationPopup, TextAnnotationPopupContentProps, TextAnnotator } from '../src';
import { W3CTextFormat, type TextAnnotation, type TextAnnotator as RecogitoTextAnnotator, HighlightStyle, TextAnnotatorOptions } from '@recogito/text-annotator';
import { v4 as uuidv4 } from 'uuid';


interface PopUpProps {
  handleSave: (annotation: TextAnnotation, selectValue: string) => void;
  handleDelete: (annotation: TextAnnotation) => void;
}

const TestPopup: FC<TextAnnotationPopupContentProps & PopUpProps> = (props) => {

  const { annotation, handleSave, handleDelete } = props;

  const [selectValue, setSelectValue] = useState<string>("Rising Star");

  const handleSelectChange = (e) => {
    setSelectValue(e.target.value);
  };

  let metadataTypeDisplay = annotation.metadataTag;

  return (
    <div className="popup" id="annotation-popup">
      <label>Choose a metadata label: </label>
      <select name="label" id="label-select" onChange={handleSelectChange}>
        <option value="Rising Star">Rising Star</option>
        <option value="Opportunity">Opportunity</option>
      </select>
      <p>{metadataTypeDisplay}</p>
      <button onClick={() => handleSave(annotation, selectValue)}>Save</button>
      <button onClick={() => handleDelete(annotation)}>Delete</button>
    </div>
  );

}

const CustomButton: FC = () => {
  const r = useAnnotator<RecogitoTextAnnotator>();

  const onLogAnnotationsClick = () => {
    if (!r) return;
    console.log(r.getAnnotations());
  }

  return <button onClick={onLogAnnotationsClick}>LOG ANNOTATIONS</button>
}

interface CustomLoadButtonProps {
  onLoadAnnotationsClick: () => void
}

const CustomLoadButton: FC<CustomLoadButtonProps> = ({onLoadAnnotationsClick}) => {

  return <button onClick={onLoadAnnotationsClick}>LOAD ANNOTATIONS</button>
}

const MyAlreadyDefinedMetaData = {
  startOffset: 440,
  endOffset: 456,
  tag: 'Rising Star',
  value: 'god Hyperion; so',
  color: '#10ff00'
}

export const App: FC = () => {
  const w3cAdapter = useCallback((container: HTMLElement) => W3CTextFormat('https://www.gutenberg.org', container), []);

  const newId = uuidv4();

  const newTextAnnotation: Partial<TextAnnotation> = {
    id: newId,
    metadataTag: MyAlreadyDefinedMetaData.tag,
    target: {
      annotation: newId,
      selector: [{
        quote: MyAlreadyDefinedMetaData.value,
        start: MyAlreadyDefinedMetaData.startOffset,
        end: MyAlreadyDefinedMetaData.endOffset,
        range: new Range()
      }],
    },
  }

  const r = useAnnotator<RecogitoTextAnnotator>();

  const myStyleFunction = <I extends TextAnnotation = TextAnnotation>(annotation: I, state: AnnotationState, zIndex?: number) : HighlightStyle | undefined => {
    let color = '#002aff'

    const fillOpacity = state.selected ? 0.9 : 0.1 * ((zIndex ?? 1) > 0 ? zIndex ?? 1 : 0.7 )

    return { underlineColor: color as Color, underlineOffset: 5 * (zIndex ?? 1), underlineThickness: 2, fillOpacity: fillOpacity} 
    
  }
  
  const store = useAnnotationStore();

  const onLoadAnnotationsClick = () => {
    store?.addAnnotation(newTextAnnotation)
  }

  const handleSave = (annotation: TextAnnotation, selectValue: string) => {

    annotation.metadataTag = selectValue;

    store!.updateAnnotation(annotation);
    r.cancelSelected();
    
  };

  const handleDelete = (annotation: TextAnnotation) => {
    store!.deleteAnnotation(annotation.id)
    r.cancelSelected();
  };

  const options: TextAnnotatorOptions = {renderer: 'SPANS'}
  return (

<>
      <CustomButton />
      <br/>
      <br/>
      <CustomLoadButton onLoadAnnotationsClick={onLoadAnnotationsClick}/>
      <TextAnnotator
        adapter={w3cAdapter} renderer={options.renderer} style={myStyleFunction}>
        <p>
        Welcome to the audio conferencing centre. Please enter a conference. You're now joining the meeting.
Oh, hello. Oh, hi, Person DD. I don't know if you just saw. I did try to call your direct dial just now, so I had some issues logging into this a few minutes ago, but is this still a good time for you, by the way, or. Great, thank you so much. Thank you again for agreeing to speak. So it's very much appreciated. Appreciate. It was all out of the blue and I'm not sure. Have you come across this before? Do you have an idea of what we do? Or would it be helpful if I just gave you a brief overview of some of that and a bit more context around this project? Or is all of that clearance? Should we just jump straight into it?
I know nothing about the project and I don't really know much about you guys, so. Yeah, why don't you.
Let's go through some of that. No worries. Thank you. Well, look, so firstly, we're a research consultancy, so we have a particular focus on the legal sector. And within that we work with a mix of law firms and corporate clients, banking institutions, a couple of PE houses, usually through some sort of growth or development initiative. So a couple of examples would be if a law firm is looking at growing or developing in some way. It might be if a corporate client is looking at testing their legal service provision or mixing up a legal panel. Or it could just be if there's a particular market of interest and a client wants to understand it in more detail. And as I'm sure you can imagine, there are plenty of online resources we can use to get us started.
Things like the legal 500 or chambers and partners, and they're all fine, but they're not necessarily always completely accurate. Often these things are a bit of a marketing tool, so we just look to speak to people like yourself that are embedded in these markets, just so we can get a more detailed and accurate and up to date view. So very broadly speaking, that's what we're about. We're working on a project, which I think I alluded to in the email, looking specifically at the legal market for us tax in London. So quite niche, quite a small market as far as we can tell at the moment. But essentially what we're trying to understand, a couple of key things.
So, one, anything sort of around upcoming trends and developments in this space, how the market operates in practise, and then just looking to understand a little bit about who the well regarded firms and practitioners are in the market, what businesses like yourselves look for, from their legal service provision, what works, what doesn't work, what could better, ultimately, all with the view to helping our client to improve their service and if relevant, you know, grow in the most effective way. So hopefully that will make sense and hopefully you have.
Yes. Let me just get the category straight in my mind. So this is the provision of legal services related to us tax?
Exactly. Well, I guess we're exploring that question and it may be that they just. And for context, I won't say exactly who it is, but, you know, you may be able to narrow it down to maybe a dozen or so firms. But I outlined the types of clients that we work with. In this case, it is a law firm, it's an international firm that already has this sort offering, albeit, you know, I think they're just sort of sense checking. You know, do they come up in discussions? How are they viewed, how are they viewed amongst some of their peer firms? And what essentially are the firms that the people like working with doing well, what could they be doing better? And essentially it's all just geared towards them improving their provision.
Their sense is that businesses like your own do find it helpful to have us tax provision in the UK. But look, that's something we're looking to test for them and see if there's anything that firms could be doing better more broadly in the space. So hopefully that context helps.
Yeah, definitely. I'm happy to help. So I guess just a little bit on the sort of history, as far as I see it, at least. I think there's been not much by way of us tax, London based us tax lawyers for many years. And then relatively recently, a couple of firms have started to really up their game. And we had. There was a sort of. So we use Company E for our flagship funds and we use knee for our other non flagship stuff, and Company E for years and years had a sort of very slim down tax offering overall, to be honest. And they basically relied on the client to go out and get kind of advice from other firms, but actually, really, I think leaning heavily on the accountants like the big four, rather than other law firms.
So for a long time, I was having to patch it up, patch up advice generally, and kind of build a bridge myself between, you know, Company Z Company A, whoever was helping us with the structuring and the law firms that were using. And I'm talking here specifically about sort of structuring advice as well as fund formation advice. So that sort of area, rather than, for example, individual kind of I don't know, you know, relocation or whatever. Right. So what, for years, it was kind of problematic. Now, what's happened is, in my view at least, is
that Company E massively up their game and they've got a couple of really decent guys, and I think we're probably not seeing all of them either. I think there's more than the ones we see, but the ones we see are really good, really proactive. And they've.
They've hired in and they've hired into London, and it means you get to meet them face to face at least once, as is the way nowadays, and then you get to obviously deal with them in the time zone that best suits you and they can just sort of join calls that are kind of group calls. So that's worked really well. Knee has always had a bit bigger, a bigger team for this sort of stuff. They're sort of funny on tax because they've had multiple team shifts, and so it's a sort of revolving door who you get a bit, but they have always had an offering. It's not, honestly, as good as what I'm seeing now with Simpsons Thatcher. I'm really impressed with the guys they've hired in. They've really taken it seriously, they've done a really good job.
And their kind of tax offering overall has massively improved. But K and E have always had something. It's just been a bit slimmed back, and then you've got these sort of much more bespoke type teams. I mean, for example, I used to be at Person AO, so I know the team there. They've always had a couple of us tax guys, but they do much more niche stuff generally. And so you sort of end up, I guess, not going to them because they can't cover everything. And that seems to be what's differentiating firms, in my view. Nowadays. If they can cover everything for you, then it's just a hell of a lot easier to go to them on everything. And you don't kind of do what you used to have to do, which was farm out sections of it and play the middleman.
And so both Company E and knee have really kind of nailed that recently. Company E, I know this isn't quite on point, but they've also upped their game when it comes to reg stuff, so general compliance and regulatory, and they've got a really decent team there as well now. So they started to become much more useful. They're not just doing fund formation work, they're doing fund formation tax, reg, you know, everything bells and whistles. So I think that's generally nowadays, that's the differentiating factor. And it's nice to be lazy as a client and just say, can you please make sure you've got your us tax guys on this call? Because I want to talk about XYZ. And then they do that and it's sort of coordinated through whoever, your client partner.
That's all super helpful. Thank you.
So, I don't know.
Yeah, it really does. Thank you. And can also just delving into some of that. So you spoke about three firms in particular there, and as I'm sure you'd probably accept, these affirms that come up again and again. So at least our research is heading in the right direction. Can I just test a couple of things on each of those you mentioned, Company SS are fairly strong in this and the only name that we've come up with so far that seems to be strong on the us tax side, based in the UK, is Person II. Is that the person you would tend to think about there or are there others that support her on that, either in the UK or based out of the US itself? Oh, hello. Oh, hello. I'm not sure if you can hear me. You seem to have. Oh, yes, sorry.
I managed to. I managed to press leave inadvertently. Apologies. I got your question. So Person II has been there forever and she is the sort of founder of the us tax practise in SDB. And, I mean, I knew of her like kind of probably 15 or more years ago and she was already there then, I believe. So she's been around forever. But that was never, in my view, a single person sort of stretched across all Company SS's clients isn't going to give you what she can do is give you sage advice on difficult topics. But what she can't do is churn the drafting because she was one person. So what's happened since is there's been a hiring spree. And so the guy that I think is brilliant is quite junior, actually. He's called Person FD something. Let me just.
Not one we had for sure, pull his name up.
Yeah, he's great. Let me just see if I can.
Person FD. Bear with me, will I?
So that's him. He's fantastic. Yeah. I mean, I think Stella. And really energetic, relatively junior, really enthusiastic. He has a guy. Let me just search in my calendar because went out for lunch with this other guy who he sort of appears to report to, but I didn't. Here we are. I wasn't as impressed. Yeah. Person XX. Is the other guy who I think is really well regarded. But maybe, I don't know. I just found Person FD to be excellent and he has consistently been excellent throughout. So I'm really impressed with so Person XX.
But Person FD seems to stand out and.
I think there, I think there are. Yeah, yeah, I think there are. I think there are other guys as well. I think they've really expanded the team. I don't think that's it.
Thank you. And Person FD and so, but I think that's just the two that we Person FD and Person XX, are. Theydehethere predominantly UK tax focused or do they do elements of uS tax as well? Would they sort of service that sort of work or.
No, they are. So Person FD is. That's a really good question, actually, because I think he does both. But he's definitely american. But I think he has helped us on some UK stuff as well. But he definitely does us stuff. Oh, and the other person is Bill Smolensky, but he is still New York based, I think, or us based at least.
Okay. Thank you.
But he's the guy that they've rolled out to us for years. He's called Person QQ.
Because, Bill, that's all super helpful. Thank you so much. And just to sense cheque as well, you mentioned what one of the other things that Company SS seemed to do quite well is that. Oh, sorry, go on.
Sorry, 1 second. No, no, I'm just looking at Person FD's sign off. I'm giving you lots of misinformation here. Sorry. I'm just looking at his sign off and he's a barrister and solicitor so he's actually a kiwi. So he's not us or UK, but he is helping us on the us side, so he's not. I think he might be sort of dual qualified or something, I don't know.
</p>
      </TextAnnotator>

      <TextAnnotationPopup
        arrow
        arrowProps={{
          fill: '#000000'
        }}
        popup={
          props => (<TestPopup {...props} handleDelete={handleDelete} handleSave={handleSave}/>)
        }
      />

      {/* <MockStorage setStoredValues={setStoredValues}/> */}
    </>
 
  );

};
