import { useFilePicker } from "use-file-picker"
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from 'use-file-picker/validators';

export default function WebBox() {
  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(['jpg', 'png']),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024}),
      new ImageDimensionsValidator({
      }),
    ],
  });

  if (loading) {
    return <div className='load'> Loading... </div>
  }

  if (errors.length) {
    return <div className='error'> Error... </div>
  }

  return (
    <div>
       <button id='picker' onClick={() => openFilePicker()}> Select files </button>
       <br />
         {filesContent.map((file, index) => (
           <div className="help" key={index}>
           <img id="img" alt={file.name} src={file.content}></img>
       <br />
    </div>
   ))}
  </div>
  )  
}


