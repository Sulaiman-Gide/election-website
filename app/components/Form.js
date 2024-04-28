import { useState, useEffect } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { auth, db, storage } from './Firebase';
import {
  onAuthStateChanged,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  collection,
  getDoc,
  query,
  getDocs,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';


function Form({ userData }) {
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedCandidateLevel, setSelectedCandidateLevel] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const candidatesCollection = collection(db, 'candidates');

    const formData = {
      name: e.target.fullName?.value || '',
      nickName: e.target.nickName?.value || '',
      candidateLevel: selectedCandidateLevel,
      candidatePost: selectedPost,
      about: e.target.about?.value || '',
      candidateEmail: e.target.email?.value || '',
      candidatePhone: e.target.phone?.value || '',
      candidateCGPPA: e.target.cgpa?.value || '',
      candidateGraduationYear: e.target.graduationYear?.value || '',
      candidateFaculty: e.target.faculty?.value || '',
      candidateRegistrationNumber: e.target.registrationNumber?.value || '',
      candidateDepartment: e.target.department?.value || '',
      timestamp: serverTimestamp(),
    };
    try {
      const storageRef = ref(storage, 'candidatesImages/' + file.name);
      toast.success('Wait uploading Image...', {
        icon: '⏳',
      });
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      formData.image1 = downloadURL;

      toast.success('Wait uploading form data...', {
        icon: '⏳',
      });

      await addDoc(candidatesCollection, formData);
      toast.success('Candidate registered successfully!');
      setLoading(false);
      setSelectedCandidateLevel('');
      setSelectedPost('');
      e.target.reset();

    } catch (error) {
      console.error('Error registering candidate: ', error);
      toast.error('Failed to register candidate. Please try again.');
      setLoading(false);
    }
  };
  
  
  return (
    <form className='px-2 sm:px-7 pt-5 pb-28 h-auto sm:overflow-y-auto sm:h-[100vh] bg-white' onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent phone number where you can receive whatsapp message.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pb-10">
            <div className="sm:col-span-3">
              <label htmlFor="registrationNumber" className="block text-sm font-medium leading-6 text-gray-900">
                Registration Number
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                  autoComplete=""
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="given-name"
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="nickName" className="block text-sm font-medium leading-6 text-gray-900">
                Nick Name
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="nickName"
                  id="nickName"
                  autoComplete="family-name"
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  required
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mobile number" className="block text-sm font-medium leading-6 text-gray-900">
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  required
                  type="phone"
                  name="phone"
                  id="phone"
                  autoComplete="phone"
                  placeholder='08101892045'
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className='sm:col-span-2'>
                <label className="block text-sm font-medium leading-6 mb-2  text-gray-900" htmlFor="grid-state">
                    Candidate Level
                  </label>
                <div className="relative">
                  <select 
                    value={selectedCandidateLevel}
                    onChange={(e) => setSelectedCandidateLevel(e.target.value)}
                    className="block appearance-none w-full bg-transparent py-2 px-2 rounded text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide font-semibold" id="grid-state">
                    <option value="" className='text-black'>Select Candidate Level</option>
                    <option value="Level 100" className='text-black'>Level 100</option>
                    <option value="Level 200" className='text-black'>Level 200</option>
                    <option value="Level 300" className='text-black'>Level 300</option>
                    <option value="Level 400" className='text-black'>Level 400</option>
                    <option value="Level 500" className='text-black'>Level 500</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
            </div>

            <div className='sm:col-span-2'>
              <label className="block text-sm font-medium leading-6 mb-2  text-gray-900" htmlFor="grid-state">
                  Post
              </label>
              <div className="relative">
                <select 
                  value={selectedPost}
                  onChange={(e) => setSelectedPost(e.target.value)}
                  className="block appearance-none w-full bg-transparent py-2 px-2 rounded text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide font-semibold" id="grid-state">
                  <option value="" className='text-black'>Select a Post</option>
                  <option value="President" className='text-black'>President</option>
                  <option value="Vice President" className='text-black'>Vice President</option>
                  <option value="Secretary General" className='text-black'>Secretary General</option>
                  <option value="Assistant Secretary General" className='text-black'>Assistant Secretary General</option>
                  <option value="Treasurer" className='text-black'>Treasurer</option>
                  <option value="Financial Secretary" className='text-black'>Financial Secretary</option>
                  <option value="Sport Director" className='text-black'>Sport Director</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                Faculty 
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="faculty"
                  id="faculty"
                  autoComplete=""
                  placeholder=''
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                Department 
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="department"
                  id="department"
                  autoComplete=""
                  placeholder='Mathematics'
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cgpa" className="block text-sm font-medium leading-6 text-gray-900">
                Candidate CGPA 
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="cgpa"
                  id="cgpa"
                  autoComplete=""
                  placeholder='5.0'
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                Expected Year of Graduation 
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  name="graduationYear"
                  id="graduationYear"
                  autoComplete=""
                  placeholder='2024'
                  className="px-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900/10">
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                  About The Candidate
                </label>
                <div className="mt-2">
                  <textarea
                    required
                    id="about"
                    name="about"
                    rows={3}
                    className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 tracking-wide"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Describe candidate briefly and give out candidate manifesto.
                </p>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Candidate photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 sm:px-5">
        {!loading && <button
          type="submit"
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>}
        {loading && <button
          type='button'
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <CircularProgress  className='text-white w-10 h-10' />
        </button>}
      </div>
    </form>
  )
}

export default Form
