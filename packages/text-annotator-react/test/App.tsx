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
        Tell me, O muse, of that ingenious hero who travelled far and wide
          after he had sacked the famous town of Troy. Many cities did he
          visit, and many were the nations with whose manners and customs
          he was acquainted; moreover he suffered much by sea while trying
          to save his own life and bring his men safely home; but do what
          he might he could not save his men, for they perished through their
          own sheer folly in eating the cattle of the Sun-god Hyperion; so the
          god prevented them from ever reaching home. Tell me, too, about all
          these things, O daughter of Jove, from whatsoever source you may know them.
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
