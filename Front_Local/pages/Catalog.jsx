 import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';

import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from 'react-redux';
import { createCategorySlug } from '../utils/helper'; 
const Catalog = () => {
     
    const {catalogName} = useParams();
    
    

    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(false);

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            setLoading(true);
            try { 
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                

                const allCategories = res?.data?.allCategory || []; 

                // The filter logic must match the slugification
                const filteredCategories = allCategories.filter((ct) => 
                    createCategorySlug(ct.name) === createCategorySlug(catalogName)
                );

                 

                let category_id = null; 
                if (filteredCategories && filteredCategories.length > 0) {
                    category_id = filteredCategories[0]._id; 
                }

                 
                setCategoryId(category_id);

            } catch (error) {
                console.error("Frontend: Error fetching categories or processing catalogName:", error);
                setLoading(false);
                setCategoryId(null); 
            }
        };
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            setLoading(true)
            try{
                 
                const res = await getCatalogaPageData(categoryId); 
                 
                if (res.success) {
                    setCatalogPageData(res);
                }
                else{
                    setCatalogPageData(null)
                }
                setLoading(false)
            }
            catch(error) {
                console.log("Frontend: CATALOG PAGE DATA API ERROR....", error)
                setLoading(false) 
            }
        }
        if(categoryId) { 
            getCategoryDetails();
        } else { 
             
            setLoading(false); 
            setCatalogPageData(null); 
        }
    },[categoryId]);


    // Component rendering logic
    if(loading){
        return (
            <div className='spinner'></div>
        )
    }
    else{
        return (
            <>
                {
                    (!catalogPageData) ? 
                    (<div className=' text-center text-xl text-[#838894] my-8'> No Courses for the category </div>)
                    : (
                    <div className=''>
                        {/* Hero Section */}
                        <div className=' box-content bg-[#161D29] px-4 py-12'>
                            <div className='mx-auto min-h-[260px] max-w-[650px] flex flex-col justify-center gap-4 lg:max-w-[1280px]'>
                                <p className='text-[#AFB2BF] text-sm'>{`Home / Catalog / `}
                                <span className='text-[#E7C000]'>{catalogPageData?.selectedCategory?.name}</span></p>
                                <p className='text-3xl text-[#F1F2FF]'>{catalogPageData?.selectedCategory?.name}</p>
                                <p className='text-[#AFB2BF] max-w-[870px]'>{catalogPageData?.selectedCategory?.description}</p>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <div className=' mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1280px]'>
                            <div className='text-[#BA3356]'>Courses to get you started</div>
                            <div className='my-4'>
                                <CourseSlider Courses={catalogPageData?.selectedCategory?.course}/>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className=' mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1280px]'>
                            <div className='text-[#049069]'>Top courses in {catalogPageData?.differentCourses?.name || "other categories"}</div>
                            <div className='py-8'>
                                <CourseSlider Courses={catalogPageData?.differentCourses?.course}/>
                            </div>
                        </div>

                        {/* section3 */}
                        <div className=' mx-auto box-content w-full max-w-[650px] px-4 py-12 lg:max-w-[1280px]'>
                            <div className='text-[#B89144]'>Most Selling Courses</div>
                            <div className='py-8'>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {
                                        catalogPageData?.mostSellingCourses?.length === 0 ? (
                                            <p className=' text-xl text-white'>No Most selling courses</p>
                                        ) : (
                                            catalogPageData?.mostSellingCourses?.slice(0,4)
                                            .map((course, index) => (
                                                <Course_Card course={course} key={index} Height={"h-[250px]"}/>
                                            ))
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }
            </>
          );
    }
};

export default Catalog;