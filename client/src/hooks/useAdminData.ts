import { useAdminAuth } from '../contexts/AdminContext';

export function useAdminData() {
  const { data } = useAdminAuth();
  
  const filteredData = {
    heroSlides: data.heroSlides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order),
    offerings: data.offerings.filter(offering => offering.isActive).sort((a, b) => a.order - b.order),
    statistics: data.statistics.filter(stat => stat.isActive).sort((a, b) => a.order - b.order),
    regulatoryApprovals: data.regulatoryApprovals.filter(approval => approval.isActive).sort((a, b) => a.order - b.order)
  };
  
  console.log('📊 useAdminData hook - Raw data counts:', {
    heroSlides: data.heroSlides.length,
    offerings: data.offerings.length,
    statistics: data.statistics.length,
    regulatoryApprovals: data.regulatoryApprovals.length
  });
  
  console.log('📊 useAdminData hook - Filtered data counts:', {
    heroSlides: filteredData.heroSlides.length,
    offerings: filteredData.offerings.length,
    statistics: filteredData.statistics.length,
    regulatoryApprovals: filteredData.regulatoryApprovals.length
  });
  
  return filteredData;
}
